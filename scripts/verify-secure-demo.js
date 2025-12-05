const { run } = require("hardhat");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env.local") });

async function main() {
  const contractAddress = "0xF8f1b1cabce0a868C52d11340BBFF360309df998";
  const deployerAddress = "0xF93F07b1b35b9DF13e2d53DbAd49396f0A9538D9";

  console.log("🔍 Verifying SecureDemoContract on Basescan...\n");
  console.log("Contract Address:", contractAddress);
  console.log("Deployer Address:", deployerAddress);
  console.log("API Key configured:", !!process.env.BASESCAN_API_KEY || !!process.env.ETHERSCAN_API_KEY);
  console.log("");

  // Verify SecureDemoContract
  console.log("📋 Verifying SecureDemoContract...");
  try {
    await run("verify:verify", {
      address: contractAddress,
      constructorArguments: [deployerAddress],
      network: "baseSepolia",
    });
    console.log("✅ SecureDemoContract verified successfully!\n");
  } catch (error) {
    if (error.message.includes("Already Verified") || error.message.includes("already verified")) {
      console.log("✅ SecureDemoContract already verified\n");
    } else {
      console.error("❌ Error verifying SecureDemoContract:", error.message);
      console.error("\nFull error:", error);
      
      // Provide helpful troubleshooting info
      if (!process.env.BASESCAN_API_KEY && !process.env.ETHERSCAN_API_KEY) {
        console.error("\n⚠️  TIP: BASESCAN_API_KEY or ETHERSCAN_API_KEY not found in .env.local");
        console.error("   Get your API key from: https://basescan.org/apis");
        console.error("   Add to .env.local: BASESCAN_API_KEY=your_api_key_here");
      }
    }
  }

  console.log("=".repeat(60));
  console.log("📊 VERIFICATION SUMMARY");
  console.log("=".repeat(60));
  console.log("SecureDemoContract:", contractAddress);
  console.log("  View on Basescan: https://sepolia.basescan.org/address/" + contractAddress);
  console.log("\n✅ Verification complete!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

