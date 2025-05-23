import fs from "fs/promises";
import path from "path";
import { getCreateAddress } from "ethers";
import dotenv from "dotenv";

dotenv.config();

// const CONTRACTS_DIR = path.resolve(process.cwd(), "contracts/lib");
// const GATEWAY_DIR = path.resolve(process.cwd(), "contracts/gateway/lib");

export function computeCreateAddress(from, nonce) {
  return getCreateAddress({ from, nonce });
}

async function writeToFile(filePath, content) {
  try {
    await fs.writeFile(filePath, content, { flag: "w" });
    console.log(`File written: ${filePath}`);
  } catch (err) {
    console.log(`Write failed: ${filePath}, Error: ${err}`);
  }
}

async function computeContractAddress(
  deployerAddress,
  nonce,
  envFile,
  solidityFile,
  constantName,
  contractDir,
) {
  const contractAddress = computeCreateAddress(deployerAddress, nonce);
  console.log(`${constantName}: ${contractAddress}`);

  const envPath = `${contractDir}/${envFile}`;
  const solidityPath = `${contractDir}/${solidityFile}`;


  await writeToFile(envPath, `${constantName}=${contractAddress}\n`);
  const solidityTemplate = `// SPDX-License-Identifier: BSD-3-Clause-Clear
pragma solidity ^0.8.24;
address constant ${constantName} = ${contractAddress};\n`;
  await writeToFile(solidityPath, solidityTemplate);
}

async function computeCoreAddresses(output, deployerAddress, deployerAddressGateway) {

  const CONTRACTS_DIR = `${output}/contracts/lib`;
  const GATEWAY_DIR = `${output}/contracts/gateway/lib`;

  const tasks = [
    [0, ".env.acl", "ACLAddress.sol", "ACL_CONTRACT_ADDRESS", CONTRACTS_DIR],
    [
      1,
      ".env.exec",
      "FHEVMCoprocessorAddress.sol",
      "FHEVM_COPROCESSOR_ADDRESS",
      CONTRACTS_DIR,
    ],
    [
      2,
      ".env.kmsverifier",
      "KMSVerifierAddress.sol",
      "KMS_VERIFIER_CONTRACT_ADDRESS",
      CONTRACTS_DIR,
    ],
  ];

  for (const [
    nonce,
    envFile,
    solidityFile,
    constantName,
    contractDir,
  ] of tasks) {
    await computeContractAddress(
      deployerAddress,
      nonce,
      envFile,
      solidityFile,
      constantName,
      contractDir,
    );
  }
  await computeContractAddress(
    deployerAddressGateway,
    0,
    ".env.gateway",
    "PredeployAddress.sol",
    "GATEWAY_CONTRACT_PREDEPLOY_ADDRESS",
    GATEWAY_DIR,
  );
}

export { computeCoreAddresses };
