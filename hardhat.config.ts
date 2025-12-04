import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";

// Load environment variables from .env.local
dotenv.config({ path: ".env.local" });

// Ensure DEPLOYER_PRIVATE_KEY has 0x prefix if needed
if (process.env.DEPLOYER_PRIVATE_KEY && !process.env.DEPLOYER_PRIVATE_KEY.startsWith("0x")) {
  process.env.DEPLOYER_PRIVATE_KEY = "0x" + process.env.DEPLOYER_PRIVATE_KEY;
}

const config: HardhatUserConfig = {
  // TypeScript configuration
  typechain: {
    outDir: "typechain-types",
    target: "ethers-v6",
  },
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200, // Optimize for deployment cost
      },
      viaIR: false, // Disable IR-based compilation for faster builds
      evmVersion: "paris", // Use Paris EVM version (latest stable)
    },
  },
  networks: {
    baseSepolia: {
      url: process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC || "https://sepolia.base.org",
      accounts: process.env.DEPLOYER_PRIVATE_KEY ? [process.env.DEPLOYER_PRIVATE_KEY] : [],
      chainId: 84532,
    },
    arbitrumSepolia: {
      url: process.env.NEXT_PUBLIC_ARBITRUM_SEPOLIA_RPC || "https://sepolia-rollup.arbitrum.io/rpc",
      accounts: process.env.DEPLOYER_PRIVATE_KEY ? [process.env.DEPLOYER_PRIVATE_KEY] : [],
      chainId: 421614,
    },
    sepolia: {
      url: process.env.NEXT_PUBLIC_ETHEREUM_SEPOLIA_RPC || "https://rpc.sepolia.org",
      accounts: process.env.DEPLOYER_PRIVATE_KEY ? [process.env.DEPLOYER_PRIVATE_KEY] : [],
      chainId: 11155111,
    },
  },
  etherscan: {
    // Use Basescan API key for Base Sepolia verification
    apiKey: process.env.BASESCAN_API_KEY || process.env.ETHERSCAN_API_KEY || "",
    customChains: [
      {
        network: "baseSepolia",
        chainId: 84532,
        urls: {
          apiURL: "https://api-sepolia.basescan.org/api",
          browserURL: "https://sepolia.basescan.org",
        },
      },
      {
        network: "arbitrumSepolia",
        chainId: 421614,
        urls: {
          apiURL: "https://api-sepolia.arbiscan.io/api",
          browserURL: "https://sepolia.arbiscan.io",
        },
      },
    ],
  },
  sourcify: {
    enabled: true,
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
};

export default config;

