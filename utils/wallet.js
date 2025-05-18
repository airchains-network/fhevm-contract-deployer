import { mnemonicToSeedSync } from "bip39";
import { hdkey } from "@ethereumjs/wallet";
import { JsonRpcProvider, Wallet, parseEther } from "ethers";


export function deriveAddressesFromMnemonic(mnemonic, count = 10) {
  const seed = mnemonicToSeedSync(mnemonic);
  const hdWallet = hdkey.EthereumHDKey.fromMasterSeed(seed);

  const addresses = [];
  for (let i = 0; i < count; i++) {
    const child = hdWallet.derivePath(`m/44'/60'/0'/0/${i}`).getWallet();
    addresses.push(child.getAddressString());
  }
  return addresses;
}

export async function deriveWalletsAndDetails(networkUrl, privateKey, mnemonic) {
  const seed = mnemonicToSeedSync(mnemonic);
  const hdWallet = hdkey.EthereumHDKey.fromMasterSeed(seed);

  const wallets = [
    hdWallet.derivePath(`m/44'/60'/0'/0/0`).getWallet(),
    hdWallet.derivePath(`m/44'/60'/0'/0/1`).getWallet(),
    hdWallet.derivePath(`m/44'/60'/0'/0/2`).getWallet(),
  ];

  const [coreWallet, gatewayWallet, relayerWallet] = wallets;
  const privateKeyCore = coreWallet.getPrivateKeyString();
  const privateKeyGateway = gatewayWallet.getPrivateKeyString();
  const privateKeyRelayer = relayerWallet.getPrivateKeyString();

  const deployerAddressCore = coreWallet.getAddressString();
  const deployerAddressGateway = gatewayWallet.getAddressString();
  const relayerAddress = gatewayWallet.getAddressString();


  let recipientAddresses = [
    deployerAddressCore,
    deployerAddressGateway,
    relayerAddress
  ];

  await sendTokens(networkUrl, privateKey, recipientAddresses);

  return {
    deployerAddressCore,
    privateKeyCore,
    deployerAddressGateway,
    privateKeyGateway,
    privateKeyRelayer,
  };
}


async function sendTokens(networkUrl, privateKey, recipientAddresses) {

  const amountToSend = parseEther("10");

  const provider = new JsonRpcProvider(networkUrl);

  const wallet = new Wallet(privateKey, provider);

  for (const address of recipientAddresses) {
    try {
      console.log(`Sending 10 token to ${address}...`);

      // Create a transaction
      const tx = await wallet.sendTransaction({
        to: address,
        value: amountToSend,
      });

      console.log(`Transaction sent: ${tx.hash}`);
      await tx.wait(); // Wait for the transaction to be mined
      console.log(`Transaction confirmed: ${tx.hash}`);
    } catch (error) {
      console.error(`Failed to send to ${address}:`, error);
    }
  }
}