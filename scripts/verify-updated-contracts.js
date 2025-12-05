const { run } = require("hardhat");

async function main() {
  const auditRegistryAddress = "0x6D3d5487c41E1759b5457f5C29f8d41caC51a8eF";
  const guardNFTAddress = "0xE429b1AFD7BDd12ceDB69777538f5925CB6CeF52";
  const deployerAddress = "0xF93F07b1b35b9DF13e2d53DbAd49396f0A9538D9";

  console.log("🔍 Verifying updated contracts on Basescan...\n");

  // Verify AuditRegistry
  console.log("📋 Verifying AuditRegistry...");
  try {
    await run("verify:verify", {
      address: auditRegistryAddress,
      constructorArguments: [deployerAddress],
      network: "baseSepolia",
    });
    console.log("✅ AuditRegistry verified successfully!\n");
  } catch (error) {
    if (error.message.includes("Already Verified")) {
      console.log("✅ AuditRegistry already verified\n");
    } else {
      console.error("❌ Error verifying AuditRegistry:", error.message);
    }
  }

  // Verify GuardNFT
  console.log("🎨 Verifying GuardNFT...");
  try {
    await run("verify:verify", {
      address: guardNFTAddress,
      constructorArguments: [deployerAddress, auditRegistryAddress],
      network: "baseSepolia",
    });
    console.log("✅ GuardNFT verified successfully!\n");
  } catch (error) {
    if (error.message.includes("Already Verified")) {
      console.log("✅ GuardNFT already verified\n");
    } else {
      console.error("❌ Error verifying GuardNFT:", error.message);
    }
  }

  console.log("=".repeat(60));
  console.log("📊 VERIFICATION SUMMARY");
  console.log("=".repeat(60));
  console.log("AuditRegistry:", auditRegistryAddress);
  console.log("  View on Basescan: https://sepolia.basescan.org/address/" + auditRegistryAddress);
  console.log("\nGuardNFT:", guardNFTAddress);
  console.log("  View on Basescan: https://sepolia.basescan.org/address/" + guardNFTAddress);
  console.log("\n✅ Verification complete!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

