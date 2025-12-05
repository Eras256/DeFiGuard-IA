import { NextRequest, NextResponse } from "next/server";
import { nullShotAuditorAgent } from "@/lib/agents/nullshot-auditor-agent";
import { VulnerabilityAnalysis } from "@/lib/gemini/client";

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
    const { code, contractAddress } = body;

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

    console.log(`[API] Starting contract analysis with GEMINI IA + MCP NullShot Architecture... Code length: ${code.length} chars`);

    // Analyze contract using NullShot Framework with Gemini IA + MCP
    const analysis = await nullShotAuditorAgent.analyzeContract(code, contractAddress);

    // Validar estructura de respuesta
    if (!analysis.vulnerabilities || !Array.isArray(analysis.vulnerabilities)) {
      console.error("[API] Invalid response structure:", analysis);
      return NextResponse.json(
        {
          success: false,
          error: "Invalid analysis response structure. Please try again.",
          modelUsed: analysis.modelUsed,
        },
        { status: 500 }
      );
    }

    console.log(`[API] ✅ Analysis complete. Model used: ${analysis.modelUsed}. Found ${analysis.vulnerabilities.length} vulnerabilities. MCP Integration: ${analysis.mcpData ? 'Enabled' : 'Disabled'}`);

    // Extraer solo los datos de análisis sin modelUsed y mcpData para compatibilidad
    const { modelUsed, mcpData, ...analysisData } = analysis;

    return NextResponse.json({
      success: true,
      data: analysisData,
      modelUsed: modelUsed || "gemini-2.5-flash",
      mcpEnabled: !!mcpData,
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

