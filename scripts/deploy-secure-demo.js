const { ethers } = require("hardhat");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env.local") });

async function main() {
  console.log("🚀 Starting deployment of SecureDemoContract...\n");
  console.log("🔍 Checking environment...");
  console.log("DEPLOYER_PRIVATE_KEY exists:", !!process.env.DEPLOYER_PRIVATE_KEY);
  console.log("DEPLOYER_PRIVATE_KEY length:", process.env.DEPLOYER_PRIVATE_KEY?.length || 0);

  // Get provider
  const provider = ethers.provider;
  
  // Get deployer account
  let deployer;
  if (process.env.DEPLOYER_PRIVATE_KEY) {
    try {
      // Ensure private key has 0x prefix
      let privateKey = process.env.DEPLOYER_PRIVATE_KEY.trim();
      if (!privateKey.startsWith("0x")) {
        privateKey = "0x" + privateKey;
      }
      deployer = new ethers.Wallet(privateKey, provider);
      console.log("📝 Using deployer from DEPLOYER_PRIVATE_KEY");
    } catch (error) {
      console.error("❌ ERROR creating wallet from DEPLOYER_PRIVATE_KEY:", error.message);
      process.exit(1);
    }
  } else {
    // Use default signer from Hardhat
    try {
      const signers = await ethers.getSigners();
      if (signers.length === 0) {
        console.error("❌ ERROR: No signers available. Please configure DEPLOYER_PRIVATE_KEY in .env.local");
        process.exit(1);
      }
      deployer = signers[0];
      console.log("📝 Using default Hardhat signer");
    } catch (error) {
      console.error("❌ ERROR getting signers:", error.message);
      console.error("Please ensure DEPLOYER_PRIVATE_KEY is set in .env.local");
      process.exit(1);
    }
  }
  
  console.log("📝 Deploying contract with account:", deployer.address);
  
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("💰 Account balance:", ethers.formatEther(balance), "ETH\n");

  if (balance === 0n) {
    console.error("❌ ERROR: Account has no balance. Please fund your account with testnet ETH.");
    console.log("💧 Get testnet ETH from: https://www.alchemy.com/faucets/base-sepolia");
    process.exit(1);
  }

  // Deploy SecureDemoContract
  console.log("📋 Deploying SecureDemoContract...");
  const SecureDemoContract = await ethers.getContractFactory("SecureDemoContract");
  const secureDemo = await SecureDemoContract.deploy(deployer.address);
  await secureDemo.waitForDeployment();
  const contractAddress = await secureDemo.getAddress();
  console.log("✅ SecureDemoContract deployed to:", contractAddress);

  // Get deployment transaction details
  const deploymentTx = secureDemo.deploymentTransaction();
  if (deploymentTx) {
    console.log("📝 Deployment transaction hash:", deploymentTx.hash);
    const receipt = await deploymentTx.wait();
    console.log("⛽ Gas used:", receipt.gasUsed.toString());
  }

  // Wait for transaction to be confirmed
  console.log("\n⏳ Waiting for transaction confirmation...");
  if (deploymentTx) {
    await deploymentTx.wait(1);
  }
  
  // Verify contract state
  console.log("\n🔍 Verifying contract state...");
  try {
    const owner = await secureDemo.owner();
    const totalSupply = await secureDemo.totalSupply();
    const maxBalance = await secureDemo.MAX_BALANCE_PER_ADDRESS();
    const isPaused = await secureDemo.paused();
    
    console.log("   Owner:", owner);
    console.log("   Total Supply:", totalSupply.toString());
    console.log("   Max Balance Per Address:", ethers.formatEther(maxBalance), "tokens");
    console.log("   Is Paused:", isPaused);
  } catch (error) {
    console.log("   ⚠️ Could not verify contract state immediately (transaction may still be confirming)");
    console.log("   Contract is deployed and will be available shortly");
  }

  // Summary
  const network = await ethers.provider.getNetwork();
  console.log("\n" + "=".repeat(60));
  console.log("📊 DEPLOYMENT SUMMARY");
  console.log("=".repeat(60));
  console.log("Network:", network.name);
  console.log("Chain ID:", network.chainId.toString());
  console.log("\nContract Address:", contractAddress);
  console.log("Deployer Address:", deployer.address);
  console.log("\n" + "=".repeat(60));

  console.log("\n💾 Contract Information:");
  console.log(`NEXT_PUBLIC_SECURE_DEMO_CONTRACT_ADDRESS=${contractAddress}`);
  console.log(`\n🔗 View on Basescan:`);
  console.log(`https://sepolia.basescan.org/address/${contractAddress}`);
  
  console.log("\n✅ Deployment completed successfully!");
  console.log("📊 This contract should achieve a security score of 10/100 (maximum security)");
  console.log("   - Uses OpenZeppelin Ownable, ReentrancyGuard, and Pausable");
  console.log("   - Implements checks-effects-interactions pattern");
  console.log("   - Has input validation on all functions");
  console.log("   - Includes DoS protection");
  console.log("   - Emits events for all state changes");
  console.log("   - No external calls to untrusted contracts");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

