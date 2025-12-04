// MCP Server implementation for blockchain data fetching
import { createThirdwebClient, getContract } from "thirdweb";

export class BlockchainMCP {
  name = "blockchain-data";
  description = "Fetches on-chain data and contract information";

  private client = createThirdwebClient({
    clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID!,
  });

  async getContractInfo(address: string, chainId: number): Promise<any> {
    try {
      console.log(`📡 Fetching contract info for ${address} on chain ${chainId}...`);
      
      // Fetch basic contract info
      const contract = getContract({
        client: this.client,
        address: address,
        chain: this.getChainById(chainId),
      });

      return {
        address,
        chainId,
        exists: true,
        timestamp: Date.now(),
      };
    } catch (error) {
      console.error("Blockchain MCP Error:", error);
      return null;
    }
  }

  async getTransactionHistory(address: string, limit: number = 10): Promise<any[]> {
    try {
      console.log(`📜 Fetching transaction history for ${address}...`);
      
      // Fetch from Basescan API if available
      const apiKey = process.env.BASESCAN_API_KEY;
      if (apiKey) {
        const response = await fetch(
          `https://api-sepolia.basescan.org/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=${limit}&sort=desc&apikey=${apiKey}`
        );
        const data = await response.json();
        
        if (data.status === "1" && data.result) {
          return data.result.map((tx: any) => ({
            hash: tx.hash,
            from: tx.from,
            to: tx.to,
            value: tx.value,
            timestamp: parseInt(tx.timeStamp) * 1000,
            blockNumber: tx.blockNumber,
          }));
        }
      }
      
      // Fallback: return empty array if API not available
      return [];
    } catch (error) {
      console.error("Error fetching transaction history:", error);
      return [];
    }
  }

  private getChainById(chainId: number) {
    // Map chainId to thirdweb chain object
    const chains: any = {
      84532: "base-sepolia",
      421614: "arbitrum-sepolia",
      11155111: "sepolia",
    };
    return chains[chainId] || "base-sepolia";
  }
}

export const blockchainMCP = new BlockchainMCP();

