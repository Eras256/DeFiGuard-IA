/**
 * Test de integración MCP con Advanced Auditor Agent
 * Ejecutar con: pnpm exec tsx lib/agents/__tests__/test-mcp-integration.ts
 */

// Configurar variables de entorno
process.env.GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";
process.env.GOOGLE_GENERATIVE_AI_API_KEY = process.env.GEMINI_API_KEY;
process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID = process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID || "test-client-id";

import { advancedAuditorAgent } from "../advanced-auditor-agent";

const testContract = `
pragma solidity ^0.8.0;

contract VulnerableContract {
    mapping(address => uint256) public balances;
    
    function withdraw() public {
        uint256 amount = balances[msg.sender];
        require(amount > 0, "No balance");
        
        // Vulnerabilidad de reentrancy
        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Transfer failed");
        
        balances[msg.sender] = 0;
    }
    
    function deposit() public payable {
        balances[msg.sender] += msg.value;
    }
}
`;

async function testMCPIntegration() {
  console.log("🧪 Testing MCP Integration with Advanced Auditor Agent\n");
  console.log("=" .repeat(60));
  
  try {
    console.log("\n📝 Test Contract:");
    console.log("- Length:", testContract.length, "chars");
    console.log("- Contains reentrancy vulnerability: Yes");
    
    console.log("\n🔍 Starting analysis with MCP servers...");
    console.log("Expected MCP servers:");
    console.log("  ✓ Slither MCP (static analysis)");
    console.log("  ✓ DeFi MCP (historical exploits)");
    console.log("  ✗ Blockchain MCP (no contract address provided)\n");
    
    const startTime = Date.now();
    const result = await advancedAuditorAgent.analyzeContract(testContract);
    const duration = Date.now() - startTime;
    
    console.log("\n" + "=".repeat(60));
    console.log("✅ Analysis Complete!\n");
    console.log("📊 Results:");
    console.log(`  Model Used: ${result.modelUsed}`);
    console.log(`  Vulnerabilities Found: ${result.vulnerabilities.length}`);
    console.log(`  Risk Score: ${result.riskScore}/100`);
    console.log(`  Duration: ${duration}ms`);
    console.log(`  MCP Integration: ${result.mcpData ? "✅ Enabled" : "❌ Disabled"}`);
    
    if (result.mcpData) {
      console.log("\n🔌 MCP Servers Status:");
      console.log(`  Slither: ${result.mcpData.serversUsed?.slither ? "✅ Used" : "❌ Not used"}`);
      console.log(`  DeFi: ${result.mcpData.serversUsed?.defi ? "✅ Used" : "❌ Not used"}`);
      console.log(`  Blockchain: ${result.mcpData.serversUsed?.blockchain ? "✅ Used" : "⏭️  Skipped (no address)"}`);
    }
    
    if (result.vulnerabilities.length > 0) {
      console.log("\n🚨 Vulnerabilities Detected:");
      result.vulnerabilities.forEach((vuln, index) => {
        console.log(`  ${index + 1}. ${vuln.type} (${vuln.severity})`);
        console.log(`     Line: ${vuln.line || "N/A"}`);
        console.log(`     Description: ${vuln.description.substring(0, 80)}...`);
      });
    }
    
    console.log("\n" + "=".repeat(60));
    console.log("✅ Test completed successfully!");
    
    return result;
  } catch (error: any) {
    console.error("\n❌ Test failed:", error.message);
    if (error.stack) {
      console.error("\nStack trace:", error.stack);
    }
    throw error;
  }
}

// Ejecutar test
if (require.main === module) {
  testMCPIntegration()
    .then(() => {
      console.log("\n✅ All tests passed!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("\n❌ Test failed:", error);
      process.exit(1);
    });
}

export { testMCPIntegration };

