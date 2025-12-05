import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const address = searchParams.get("address");
    const limit = parseInt(searchParams.get("limit") || "20");

    if (!address) {
      return NextResponse.json(
        { error: "Address parameter is required" },
        { status: 400 }
      );
    }

    // Use Basescan API
    const apiKey = process.env.BASESCAN_API_KEY;
    const apiKeyParam = apiKey ? `&apikey=${apiKey}` : "";
    
    const url = `https://api-sepolia.basescan.org/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=${limit}&sort=desc${apiKeyParam}`;
    
    const response = await fetch(url);
    const data = await response.json();

    if (data.status === "1" && data.result) {
      const transactions = data.result.map((tx: any) => ({
        hash: tx.hash,
        from: tx.from,
        to: tx.to,
        value: tx.value,
        timestamp: parseInt(tx.timeStamp) * 1000,
        blockNumber: tx.blockNumber,
        method: tx.methodId || "0x",
        status: tx.txreceipt_status === "1" ? "success" : "failed",
      }));

      return NextResponse.json({
        success: true,
        transactions,
      });
    }

    return NextResponse.json({
      success: true,
      transactions: [],
    });
  } catch (error: any) {
    console.error("Error fetching transactions:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch transactions" },
      { status: 500 }
    );
  }
}

