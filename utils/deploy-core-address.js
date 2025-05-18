import { JsonRpcProvider, Wallet, ContractFactory } from "ethers";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { getCompiledContract } from "./compile.js";

dotenv.config();


export async function deployCoreContract(
    privateKey,
    networkUrl,
    output,
    contractDir,
    contractFile,
    envDir,
    envFile,
    constructorArgs = [],
) {
    try {
        const compiledContract = await getCompiledContract(
            output,
            path.join(contractDir, contractFile),
        );
        const { abi, evm } = compiledContract;

        const provider = new JsonRpcProvider(networkUrl);
        const wallet = new Wallet(privateKey, provider);
        const factory = new ContractFactory(abi, evm.bytecode, wallet);

        let args = {};
        if (envFile && fs.existsSync(path.join(envDir, envFile))) {
            args = dotenv.parse(fs.readFileSync(path.join(envDir, envFile)));
        }

        const resolvedArgs = constructorArgs.map((arg) => {
            if (arg in args) return args[arg];
            if (arg) return arg; // Allow explicit arguments
            throw new Error(`Missing argument: ${arg}`);
        });

        try {
            const contract =
                resolvedArgs.length > 0
                    ? await factory.deploy(...resolvedArgs)
                    : await factory.deploy();

            return contract.target;
        } catch (error) {
            console.log(`Error deploying ${contractFile}: ${error.message}`);
        }
    } catch (error) {
        console.log(`Error deploying ${contractFile}: ${error.message}`);
    }
}