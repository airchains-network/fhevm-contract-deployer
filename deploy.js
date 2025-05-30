import { writeFileSync } from "fs";
import { deployCoreContract } from "./utils/deploy-core-address.js";
import { getEnvironmentVariables } from "./utils/env.js";
import { setupRelayer } from "./utils/gateway-relayer.js";
import { computeCoreAddresses } from "./utils/precompute-core-address.js";
import { deriveWalletsAndDetails } from "./utils/wallet.js";

async function main() {
    const { networkUrl, mnemonic, privateKey, output } = getEnvironmentVariables();
    const {
        deployerAddressCore,
        privateKeyCore,
        deployerAddressGateway,
        privateKeyGateway,
        privateKeyRelayer,
    } = await deriveWalletsAndDetails(networkUrl, privateKey, mnemonic);
    await computeCoreAddresses(output, deployerAddressCore, deployerAddressGateway);

    await deployCoreContract(
        privateKeyCore,
        networkUrl,
        output,
        "lib",
        "ACL.sol",
        "contracts/lib",
        ".env.exec",
        ["FHEVM_COPROCESSOR_ADDRESS"],
    );
    const tfhe_executor_contract_address = await deployCoreContract(
        privateKeyCore,
        networkUrl,
        output,
        "lib",
        "TFHEExecutor.sol",
        "",
        "",
    );
    await deployCoreContract(
        privateKeyCore,
        networkUrl,
        output,
        "lib",
        "KMSVerifier.sol",
        "",
        "",
    );
    const gateway_contract_address = await deployCoreContract(
        privateKeyGateway,
        networkUrl,
        output,
        "gateway",
        "GatewayContract.sol",
        "contracts/lib",
        ".env.kmsverifier",
        [deployerAddressGateway, "KMS_VERIFIER_CONTRACT_ADDRESS"],
    );

    setTimeout(() => {

    }, 3000);
    await setupRelayer(output, privateKeyGateway, networkUrl, privateKeyRelayer);
    console.log("Gateway Contract Address: ", gateway_contract_address);
    console.log("Relayer Address: ", privateKeyRelayer);

    const deploymentData = {
        tfhe_executor_contract_address,
        gateway_contract_address,
        relayer_private_key: privateKeyRelayer
    }

    writeFileSync(`${output}/fhe_config.json`, JSON.stringify(deploymentData, null, 2));
    console.log('Deployment configuration saved to deployment_config.json');
}

await main();