import { NextRequest, NextResponse } from "next/server";
import { analyzeContractWithGemini } from "@/lib/gemini/client";

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json();

    if (!code) {
      return NextResponse.json(
        { error: "Contract code is required" },
        { status: 400 }
      );
    }

    const analysis = await analyzeContractWithGemini(code);

    return NextResponse.json(analysis);
  } catch (error) {
    console.error("Gemini API Error:", error);
    return NextResponse.json(
      { error: "Analysis failed" },
      { status: 500 }
    );
  }
}

