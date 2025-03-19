import { writeFileSync } from "fs";
import { deployCoreContract } from "./utils/deploy-core-address.js";
import { getEnvironmentVariables } from "./utils/env.js";
import { setupRelayer } from "./utils/gateway-relayer.js";
import { computeCoreAddresses } from "./utils/precompute-core-address.js";
import { deriveWalletsAndDetails } from "./utils/wallet.js";

async function main() {
    const { networkUrl, mnemonic } = getEnvironmentVariables();
    const {
        deployerAddressCore,
        privateKeyCore,
        deployerAddressGateway,
        privateKeyGateway,
        privateKeyRelayer,
    } = await deriveWalletsAndDetails(mnemonic);
    await computeCoreAddresses(deployerAddressCore, deployerAddressGateway);

    await deployCoreContract(
        privateKeyCore,
        networkUrl,
        "lib",
        "ACL.sol",
        "contracts/lib",
        ".env.exec",
        ["FHEVM_COPROCESSOR_ADDRESS"],
    );
    await deployCoreContract(
        privateKeyCore,
        networkUrl,
        "lib",
        "TFHEExecutor.sol",
        "",
        "",
    );
    await deployCoreContract(
        privateKeyCore,
        networkUrl,
        "lib",
        "KMSVerifier.sol",
        "",
        "",
    );
    const gateway_contract_address = await deployCoreContract(
        privateKeyGateway,
        networkUrl,
        "gateway",
        "GatewayContract.sol",
        "contracts/lib",
        ".env.kmsverifier",
        [deployerAddressGateway, "KMS_VERIFIER_CONTRACT_ADDRESS"],
    );

    await new Promise((resolve) => setTimeout(resolve, 2000));
    await setupRelayer(privateKeyGateway, networkUrl, privateKeyRelayer);
    console.log("Gateway Contract Address: ", gateway_contract_address);
    console.log("Relayer Address: ", privateKeyRelayer);

    const deploymentData = {
        gateway_contract_address,
        relayer_private_key: privateKeyRelayer
    }

    writeFileSync('deployment_config.json', JSON.stringify(deploymentData, null, 2));
    console.log('Deployment configuration saved to deployment_config.json');
}

await main();