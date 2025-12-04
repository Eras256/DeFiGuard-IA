const { ethers } = require("hardhat");
require("dotenv").config({ path: ".env.local" });

async function main() {
  console.log("🚀 Starting deployment...\n");

  const [deployer] = await ethers.getSigners();
  console.log("📝 Deploying contracts with account:", deployer.address);
  
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("💰 Account balance:", ethers.formatEther(balance), "ETH\n");

  if (balance === 0n) {
    console.error("❌ ERROR: Account has no balance. Please fund your account with testnet ETH.");
    console.log("💧 Get testnet ETH from: https://www.alchemy.com/faucets/base-sepolia");
    process.exit(1);
  }

  // Deploy AuditRegistry
  console.log("📋 Deploying AuditRegistry...");
  const AuditRegistry = await ethers.getContractFactory("AuditRegistry");
  const auditRegistry = await AuditRegistry.deploy(deployer.address);
  await auditRegistry.waitForDeployment();
  const auditRegistryAddress = await auditRegistry.getAddress();
  console.log("✅ AuditRegistry deployed to:", auditRegistryAddress);

  // Deploy GuardNFT
  console.log("\n🎨 Deploying GuardNFT...");
  const GuardNFT = await ethers.getContractFactory("GuardNFT");
  const guardNFT = await GuardNFT.deploy(deployer.address);
  await guardNFT.waitForDeployment();
  const guardNFTAddress = await guardNFT.getAddress();
  console.log("✅ GuardNFT deployed to:", guardNFTAddress);

  // Deploy GuardToken
  console.log("\n🪙 Deploying GuardToken...");
  const GuardToken = await ethers.getContractFactory("GuardToken");
  // Deploy with deployer as owner and treasury
  const guardToken = await GuardToken.deploy(deployer.address, deployer.address);
  await guardToken.waitForDeployment();
  const guardTokenAddress = await guardToken.getAddress();
  console.log("✅ GuardToken deployed to:", guardTokenAddress);

  // Summary
  const network = await ethers.provider.getNetwork();
  console.log("\n" + "=".repeat(60));
  console.log("📊 DEPLOYMENT SUMMARY");
  console.log("=".repeat(60));
  console.log("Network:", network.name);
  console.log("Chain ID:", network.chainId.toString());
  console.log("\nContract Addresses:");
  console.log("  AuditRegistry:", auditRegistryAddress);
  console.log("  GuardNFT:", guardNFTAddress);
  console.log("  GuardToken:", guardTokenAddress);
  console.log("\n" + "=".repeat(60));

  console.log("\n💾 Save these addresses to your .env.local:");
  console.log(`NEXT_PUBLIC_AUDIT_REGISTRY_ADDRESS=${auditRegistryAddress}`);
  console.log(`NEXT_PUBLIC_GUARD_NFT_ADDRESS=${guardNFTAddress}`);
  console.log(`NEXT_PUBLIC_GUARD_TOKEN_ADDRESS=${guardTokenAddress}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

