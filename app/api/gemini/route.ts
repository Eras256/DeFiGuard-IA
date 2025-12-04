import { NextRequest, NextResponse } from "next/server";
import { analyzeContractWithGemini } from "@/lib/ai/gemini-advanced";

// Forzar runtime Node.js en Vercel
export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json();

    if (!code || typeof code !== "string") {
      return NextResponse.json(
        { success: false, error: "Contract code is required" },
        { status: 400 }
      );
    }

    const response = await analyzeContractWithGemini(code);

    if (!response.success) {
      return NextResponse.json(
        {
          success: false,
          error: response.error || "Analysis failed",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: response.data,
      modelUsed: response.modelUsed,
    });
  } catch (error: any) {
    console.error("[API] Gemini API Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Analysis failed",
      },
      { status: 500 }
    );
  }
}

