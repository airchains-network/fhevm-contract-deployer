import dotenv from "dotenv";
dotenv.config();

export function getEnvironmentVariables() {
  const networkUrlIndex = process.argv.indexOf("--network-url");
  let networkUrl;

  if (networkUrlIndex > -1 && networkUrlIndex + 1 < process.argv.length) {
    networkUrl = process.argv[networkUrlIndex + 1];
  } else {
    console.error("Error: Please provide the network url using the --network-url flag.");
    process.exit(1);
  }

  const mnemonicFlagIndex = process.argv.indexOf("--mnemonic");
  let mnemonic;

  if (mnemonicFlagIndex > -1 && mnemonicFlagIndex + 1 < process.argv.length) {
    mnemonic = process.argv[mnemonicFlagIndex + 1];
  } else {
    console.error("Error: Please provide the mnemonic using the --mnemonic flag.");
    process.exit(1);
  }

  const privateKeyIndex = process.argv.indexOf("--private-key");
  let privateKey;

  if (privateKeyIndex > -1 && privateKeyIndex + 1 < process.argv.length) {
    privateKey = process.argv[privateKeyIndex + 1];
  } else {
    console.error("Error: Please provide the private keys using the --private-key flag.");
    process.exit(1);
  }

  const outputFlagIndex = process.argv.indexOf("--output"); // ✅ Corrected
  let output;

  if (outputFlagIndex > -1 && outputFlagIndex + 1 < process.argv.length) {
    output = process.argv[outputFlagIndex + 1];
  } else {
    console.error("Error: Please provide the output using the --output flag.");
    process.exit(1);
  }

  return {
    networkUrl,
    mnemonic,
    privateKey,
    output
  };
}
