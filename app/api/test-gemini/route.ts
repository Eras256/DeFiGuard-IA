import { NextRequest, NextResponse } from "next/server";
import { callGemini } from "@/lib/ai/gemini-advanced";

// Forzar runtime Node.js en Vercel
export const runtime = "nodejs";

/**
 * Endpoint de prueba para validar conectividad con Gemini AI
 * GET /api/test-gemini
 */
export async function GET(request: NextRequest) {
  try {
    // Verificar que la API key está configurada
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      console.error("[API] GEMINI_API_KEY is not set");
      return NextResponse.json(
        {
          success: false,
          error: "GEMINI_API_KEY is not set in environment variables. Please add it to .env.local and restart the server.",
        },
        { status: 500 }
      );
    }

    // Validar que la API key no esté vacía
    if (apiKey.trim() === "") {
      console.error("[API] GEMINI_API_KEY is empty");
      return NextResponse.json(
        {
          success: false,
          error: "GEMINI_API_KEY is empty. Please check your .env.local file.",
        },
        { status: 500 }
      );
    }

    console.log("[API] Testing Gemini AI connection...");

    // Test simple con prompt básico
    const testPrompt = "Say 'Hello, Gemini AI is working!' in JSON format: {\"message\": \"your response\"}";

    const response = await callGemini(testPrompt, {
      temperature: 0.7,
      topP: 0.9,
      topK: 40,
      maxOutputTokens: 100,
    });

    if (!response.success) {
      return NextResponse.json(
        {
          success: false,
          error: response.error || "Failed to connect to Gemini AI",
          modelUsed: response.modelUsed,
        },
        { status: 500 }
      );
    }

    console.log(`[API] ✅ Gemini AI test successful. Model used: ${response.modelUsed}`);
    
    return NextResponse.json({
      success: true,
      message: "Gemini AI is connected and working!",
      modelUsed: response.modelUsed,
      response: response.data,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("[API] Test Gemini Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to test Gemini AI",
      },
      { status: 500 }
    );
  }
}

/**
 * POST endpoint para probar con prompt personalizado
 */
export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json(
        {
          success: false,
          error: "Prompt is required",
        },
        { status: 400 }
      );
    }

    const response = await callGemini(prompt);

    return NextResponse.json({
      success: response.success,
      data: response.data,
      error: response.error,
      modelUsed: response.modelUsed,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("[API] Test Gemini Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to test Gemini AI",
      },
      { status: 500 }
    );
  }
}

