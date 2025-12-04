import { NextRequest, NextResponse } from "next/server";
import { analyzeContractWithGemini, VulnerabilityAnalysis } from "@/lib/ai/gemini-advanced";

// Forzar runtime Node.js en Vercel
export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    // Verificar que la API key está configurada
    if (!process.env.GEMINI_API_KEY) {
      console.error("[API] GEMINI_API_KEY is not set");
      return NextResponse.json(
        {
          success: false,
          error: "Gemini API key is not configured. Please add GEMINI_API_KEY to .env.local and restart the server.",
        },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { code } = body;

    if (!code || typeof code !== "string") {
      return NextResponse.json(
        { success: false, error: "Invalid contract code. Code must be a non-empty string." },
        { status: 400 }
      );
    }

    // Validar tamaño del código (límite razonable: 100KB)
    if (code.length > 100000) {
      return NextResponse.json(
        { success: false, error: "Contract code is too large. Maximum size is 100KB." },
        { status: 400 }
      );
    }

    console.log(`[API] Starting contract analysis with Gemini AI... Code length: ${code.length} chars`);

    // Analyze contract using Gemini AI with fallback multi-model
    const response = await analyzeContractWithGemini(code);

    if (!response.success || !response.data) {
      console.error("[API] Analysis failed:", response.error);
      console.error("[API] Model used:", response.modelUsed);
      return NextResponse.json(
        {
          success: false,
          error: response.error || "Analysis failed",
          modelUsed: response.modelUsed,
        },
        { status: 500 }
      );
    }

    // Validar estructura de respuesta
    if (!response.data.vulnerabilities || !Array.isArray(response.data.vulnerabilities)) {
      console.error("[API] Invalid response structure:", response.data);
      return NextResponse.json(
        {
          success: false,
          error: "Invalid analysis response structure. Please try again.",
          modelUsed: response.modelUsed,
        },
        { status: 500 }
      );
    }

    console.log(`[API] ✅ Analysis complete. Model used: ${response.modelUsed}. Found ${response.data.vulnerabilities.length} vulnerabilities.`);

    return NextResponse.json({
      success: true,
      data: response.data,
      modelUsed: response.modelUsed,
    });
  } catch (error: any) {
    console.error("[API] Error analyzing contract:", error);
    console.error("[API] Error name:", error.name);
    console.error("[API] Error message:", error.message);
    if (error.stack) {
      console.error("[API] Error stack:", error.stack);
    }
    
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to analyze contract",
        details: process.env.NODE_ENV === "development" ? {
          name: error.name,
          message: error.message,
          stack: error.stack,
        } : undefined,
      },
      { status: 500 }
    );
  }
}

