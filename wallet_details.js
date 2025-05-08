import { mnemonicToSeedSync } from "bip39";
import { computeCreateAddress } from "./utils/precompute-core-address.js";
import { hdkey } from "@ethereumjs/wallet";
import { writeFileSync } from "fs";

const contract_addresses = [
    "ACL_CONTRACT_ADDRESS",
    "FHEVM_COPROCESSOR_ADDRESS",
    "KMS_VERIFIER_CONTRACT_ADDRESS",
]

async function deriveWalletsAndDetails(mnemonic) {
    const seed = mnemonicToSeedSync(mnemonic);
    const hdWallet = hdkey.EthereumHDKey.fromMasterSeed(seed);

    const wallets = [
        hdWallet.derivePath(`m/44'/60'/0'/0/0`).getWallet(),
        hdWallet.derivePath(`m/44'/60'/0'/0/1`).getWallet(),
        hdWallet.derivePath(`m/44'/60'/0'/0/2`).getWallet(),
    ];

    const [coreWallet, gatewayWallet, relayerWallet] = wallets;


    const deployerAddressCore = coreWallet.getAddressString();
    const deployerAddressGateway = gatewayWallet.getAddressString();
    const relayerAddress = relayerWallet.getAddressString();

    return {
        deployerAddressCore,
        deployerAddressGateway,
        relayerAddress
    };
}


async function walletDetails() {
    const mnemonicFlagIndex = process.argv.indexOf("--mnemonic");
    let mnemonic;

    if (mnemonicFlagIndex > -1 && mnemonicFlagIndex + 1 < process.argv.length) {
        mnemonic = process.argv[mnemonicFlagIndex + 1];
    } else {
        console.error(formatDate(), "- Error: Please provide the mnemonic using the --mnemonic flag.");
        process.exit(1);
    }

    const outputFlagIndex = process.argv.indexOf("--output"); // ✅ Corrected
    let output;

    if (outputFlagIndex > -1 && outputFlagIndex + 1 < process.argv.length) {
        output = process.argv[outputFlagIndex + 1];
    } else {
        console.error(formatDate(), "- Error: Please provide the output using the --output flag.");
        process.exit(1);
    }

    const deploymentData = {
        "aclContractAddress": "",
        "tfheExecutorAddress": "",
        "kmsVerifierAddress": "",
        "gatewayContractAddress": "",
        "relayerGAddress": ""
    }

    const {
        deployerAddressCore,
        deployerAddressGateway,
        relayerAddress
    } = await deriveWalletsAndDetails(mnemonic);

    for (let index = 0; index < contract_addresses.length; index++) {
        const contractAddress = computeCreateAddress(deployerAddressCore, index);

        if (index === 0) {
            deploymentData.aclContractAddress = contractAddress;
        } else if (index === 1) {
            deploymentData.tfheExecutorAddress = contractAddress;
        } else if (index === 2) {
            deploymentData.kmsVerifierAddress = contractAddress;
        }
    }

    const contractAddress = computeCreateAddress(deployerAddressGateway, 0);
    deploymentData.gatewayContractAddress = contractAddress;
    deploymentData.relayerGAddress = relayerAddress;

    writeFileSync(`${output}/init_rollup_fhe_keys.json`, JSON.stringify(deploymentData, null, 2));
    console.log("Wallets and contract addresses have been computed and saved to deployment_config.json");
}

(async () => {
    await walletDetails();
})();


