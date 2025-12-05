const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env.local") });

/**
 * Script para verificar las transacciones ejecutadas en Base Sepolia
 * Verifica las 8 transacciones exitosas (4 AuditRegistry + 4 GuardToken)
 */
async function main() {
  console.log("🔍 Verifying transactions on Base Sepolia...\n");

  const DEPLOYER_ADDRESS = "0xF93F07b1b35b9DF13e2d53DbAd49396f0A9538D9";
  const AUDIT_REGISTRY_ADDRESS = "0x00c754b5bBFe5030E4D9Ea9347527f57b3FDE419";
  const GUARD_TOKEN_ADDRESS = "0xBc3035ed036B280AdB9A6Ad19a46089E39e2eDED";
  const BASESCAN_API_KEY = process.env.BASESCAN_API_KEY || "";

  const apiKeyParam = BASESCAN_API_KEY ? `&apikey=${BASESCAN_API_KEY}` : "";

  console.log("📋 Contract Addresses:");
  console.log(`  Deployer: ${DEPLOYER_ADDRESS}`);
  console.log(`  AuditRegistry: ${AUDIT_REGISTRY_ADDRESS}`);
  console.log(`  GuardToken: ${GUARD_TOKEN_ADDRESS}\n`);

  // Fetch all transactions from deployer (most reliable method)
  console.log("=".repeat(60));
  console.log("📋 Fetching Transactions from Deployer");
  console.log("=".repeat(60));

  try {
    const deployerUrl = `https://api-sepolia.basescan.org/api?module=account&action=txlist&address=${DEPLOYER_ADDRESS}&startblock=0&endblock=99999999&page=1&offset=50&sort=desc${apiKeyParam}`;
    console.log("\n⏳ Fetching transactions from Basescan API...\n");
    
    const deployerResponse = await fetch(deployerUrl);
    const deployerData = await deployerResponse.json();

    if (deployerData.status === "1" && deployerData.result && deployerData.result.length > 0) {
      const allTxs = deployerData.result;
      
      // Filter AuditRegistry transactions
      const auditTxs = allTxs.filter(
        tx => tx.to && tx.to.toLowerCase() === AUDIT_REGISTRY_ADDRESS.toLowerCase() && 
        tx.from.toLowerCase() === DEPLOYER_ADDRESS.toLowerCase()
      ).slice(0, 10);

      // Filter GuardToken transactions
      const tokenTxs = allTxs.filter(
        tx => tx.to && tx.to.toLowerCase() === GUARD_TOKEN_ADDRESS.toLowerCase() && 
        tx.from.toLowerCase() === DEPLOYER_ADDRESS.toLowerCase()
      ).slice(0, 10);

      console.log("=".repeat(60));
      console.log("📊 AuditRegistry Transactions");
      console.log("=".repeat(60));
      
      if (auditTxs.length > 0) {
        const successfulAuditTxs = auditTxs.filter(tx => tx.txreceipt_status === "1");
        console.log(`\n✅ Found ${successfulAuditTxs.length} successful recordAudit transactions:\n`);

        successfulAuditTxs.slice(0, 4).forEach((tx, index) => {
          console.log(`Transaction ${index + 1}:`);
          console.log(`  ✅ Status: Success`);
          console.log(`  Hash: ${tx.hash}`);
          console.log(`  Block: ${tx.blockNumber}`);
          console.log(`  Gas Used: ${parseInt(tx.gasUsed).toLocaleString()}`);
          console.log(`  Gas Price: ${(parseInt(tx.gasPrice) / 1e9).toFixed(2)} Gwei`);
          console.log(`  Timestamp: ${new Date(parseInt(tx.timeStamp) * 1000).toLocaleString()}`);
          console.log(`  🔗 https://sepolia.basescan.org/tx/${tx.hash}\n`);
        });
      } else {
        console.log("\n⚠️  No AuditRegistry transactions found");
      }

      console.log("=".repeat(60));
      console.log("🪙 GuardToken Transactions");
      console.log("=".repeat(60));

      if (tokenTxs.length > 0) {
        const successfulTokenTxs = tokenTxs.filter(tx => tx.txreceipt_status === "1");
        console.log(`\n✅ Found ${successfulTokenTxs.length} successful GuardToken transactions:\n`);

        successfulTokenTxs.slice(0, 4).forEach((tx, index) => {
          console.log(`Transaction ${index + 1}:`);
          console.log(`  ✅ Status: Success`);
          console.log(`  Hash: ${tx.hash}`);
          console.log(`  Block: ${tx.blockNumber}`);
          console.log(`  Gas Used: ${parseInt(tx.gasUsed).toLocaleString()}`);
          console.log(`  Gas Price: ${(parseInt(tx.gasPrice) / 1e9).toFixed(2)} Gwei`);
          console.log(`  Timestamp: ${new Date(parseInt(tx.timeStamp) * 1000).toLocaleString()}`);
          console.log(`  🔗 https://sepolia.basescan.org/tx/${tx.hash}\n`);
        });
      } else {
        console.log("\n⚠️  No GuardToken transactions found");
      }

      // Summary
      console.log("=".repeat(60));
      console.log("📊 VERIFICATION SUMMARY");
      console.log("=".repeat(60));
      
      const totalSuccessful = auditTxs.filter(tx => tx.txreceipt_status === "1").length + 
                              tokenTxs.filter(tx => tx.txreceipt_status === "1").length;
      
      console.log(`\n✅ AuditRegistry successful transactions: ${auditTxs.filter(tx => tx.txreceipt_status === "1").length}`);
      console.log(`✅ GuardToken successful transactions: ${tokenTxs.filter(tx => tx.txreceipt_status === "1").length}`);
      console.log(`\n📈 Total successful test transactions: ${totalSuccessful}/8 expected`);
      
      if (totalSuccessful >= 8) {
        console.log("\n🎉 All 8 transactions verified successfully!");
      } else {
        console.log(`\n⚠️  Found ${totalSuccessful} successful transactions, expected 8`);
      }

    } else {
      console.log("❌ Error: Could not fetch transactions from API");
      console.log("Response:", deployerData);
    }
  } catch (error) {
    console.error("❌ Error fetching transactions:", error.message);
    console.error("\n💡 Tip: Make sure BASESCAN_API_KEY is set in .env.local for better results");
  }

  console.log("\n" + "=".repeat(60));
  console.log("🔗 View on Basescan:");
  console.log(`  Deployer: https://sepolia.basescan.org/address/${DEPLOYER_ADDRESS}#txns`);
  console.log(`  AuditRegistry: https://sepolia.basescan.org/address/${AUDIT_REGISTRY_ADDRESS}#txns`);
  console.log(`  GuardToken: https://sepolia.basescan.org/address/${GUARD_TOKEN_ADDRESS}#txns`);
  console.log("=".repeat(60));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
