import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import { BaseSepoliaTestnet, ArbitrumSepolia } from "@thirdweb-dev/chains";

export function getThirdwebSDK(chainId: number) {
  const chain = chainId === 84532 ? BaseSepoliaTestnet : ArbitrumSepolia;
  
  return new ThirdwebSDK(chain, {
    clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID,
    secretKey: process.env.THIRDWEB_SECRET_KEY,
  });
}

export async function deployAuditRegistry(sdk: ThirdwebSDK) {
  const contract = await sdk.deployer.deployBuiltInContract("custom", {
    name: "DeFiGuardAuditRegistry",
    primary_sale_recipient: await sdk.wallet.getAddress(),
  });
  
  // The contract object should have an address property or method
  // Check if it's a string (address) or has a getAddress method
  if (typeof contract === "string") {
    return contract;
  }
  
  // Try to get address from contract object
  const contractObj = contract as any;
  if ("address" in contractObj && typeof contractObj.address === "string") {
    return contractObj.address;
  }
  
  // Fallback: try getAddress method if it exists
  if (typeof contractObj.getAddress === "function") {
    return contractObj.getAddress();
  }
  
  throw new Error("Could not get contract address from deployed contract");
}

export async function recordAudit(
  sdk: ThirdwebSDK,
  registryAddress: string,
  contractAddress: string,
  riskScore: number
) {
  const contract = await sdk.getContract(registryAddress);
  
  const tx = await contract.call("recordAudit", [
    contractAddress,
    riskScore,
    Math.floor(Date.now() / 1000),
  ]);
  
  return tx.receipt.transactionHash;
}
