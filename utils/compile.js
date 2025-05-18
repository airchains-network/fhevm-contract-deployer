import solc from "solc";
import fs from "fs";
import path from "path";

// Ensure the output directory exists
function ensureOutputDirExists(output) {
  if (!fs.existsSync(output)) {
    fs.mkdirSync(output, { recursive: true });
  }
}

// Create the input format required by the Solidity compiler
function createCompilerInput(relativePath, source) {
  return {
    language: "Solidity",
    sources: {
      [relativePath]: {
        content: source,
      },
    },
    settings: {
      outputSelection: {
        "*": {
          "*": ["abi", "evm.bytecode"],
        },
      },
    },
  };
}

// Compile the contract using the Solidity compiler
function compileContract(output, input) {
  // Custom import handler for Solidity compiler to resolve imports
  function findImports(importPath) {
    const CONTRACTS_DIR = path.join(output, "contracts");
    const NODE_MODULES_DIR = path.join(output, "node_modules");
    
    try {
      // First try in the contracts directory
      let fullPath = path.resolve(CONTRACTS_DIR, importPath);
      if (fs.existsSync(fullPath)) {
        return { contents: fs.readFileSync(fullPath, "utf8") };
      }
      
      // Then try in node_modules
      fullPath = path.resolve(NODE_MODULES_DIR, importPath);
      if (fs.existsSync(fullPath)) {
        return { contents: fs.readFileSync(fullPath, "utf8") };
      }
      
      console.log(`Import file not found: ${importPath}`);
      throw new Error(`Import file not found: ${importPath}`);
    } catch (error) {
      return { error: error.message };
    }
  }
  const output_json = solc.compile(JSON.stringify(input), { import: findImports });
  return JSON.parse(output_json);
}

// Handle compilation errors, ignore warnings
function handleCompilationErrors(errors) {
  errors.forEach((error) => {
    if (error.severity === "error") {
      throw new Error(`Solidity compilation error: ${error.formattedMessage}`);
    }
  });
}

// Extract the compiled contract's ABI and bytecode
function extractCompiledContract(output, relativePath) {
  const contractName = Object.keys(output.contracts[relativePath])[0];
  return output.contracts[relativePath][contractName];
}

// Write the ABI to a file
function writeABIToFile(output, relativePath, abi) {
  const OUTPUT_DIR = path.join(output, "build");
  ensureOutputDirExists(OUTPUT_DIR);
  const abiPath = path.join(
    OUTPUT_DIR,
    `${path.basename(relativePath, ".sol")}.json`,
  );
  fs.writeFileSync(abiPath, JSON.stringify(abi, null, 2));
  console.log(`ABI written to ${abiPath}`);
}

// Read the source code of the contract from the file
function readContractSource(output, relativePath) {
  const CONTRACTS_DIR = path.join(output, "contracts");
  const contractPath = path.resolve(CONTRACTS_DIR, relativePath);
  if (!fs.existsSync(contractPath)) {
    throw new Error(`Contract file not found: ${relativePath}`);
  }
  return fs.readFileSync(contractPath, "utf8");
}

// Compile a contract by relative path from the contracts directory
export async function getCompiledContract(output, relativePath) {
  try {
    console.log(`Compiling contract: ${relativePath}`);
    const source = readContractSource(output, relativePath);
    const input = createCompilerInput(relativePath, source);
    const contract_output = compileContract(output, input);

    if (contract_output.errors) {
      handleCompilationErrors(contract_output.errors);
    }

    const compiledContract = extractCompiledContract(contract_output, relativePath);

    if (!compiledContract.evm || !compiledContract.evm.bytecode) {
      throw new Error(
        `Bytecode is missing in compiled output for ${relativePath}`,
      );
    }

    writeABIToFile(output, relativePath, compiledContract.abi);

    return compiledContract;
  } catch (error) {
    console.log(`Error compiling contract ${relativePath}: ${error.message}`);
    throw error;
  }
}
