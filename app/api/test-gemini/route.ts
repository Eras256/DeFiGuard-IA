import { NextRequest, NextResponse } from "next/server";
import { callGemini } from "@/lib/ai/gemini-advanced";

// Forzar runtime Node.js en Vercel
export const runtime = "nodejs";

// Cache para almacenar el último estado verificado
let statusCache: {
  success: boolean;
  modelUsed?: string;
  error?: string;
  timestamp: number;
} | null = null;

// Tiempo de validez del cache (5 minutos)
const CACHE_TTL = 5 * 60 * 1000;

/**
 * Endpoint de prueba para validar conectividad con Gemini AI
 * GET /api/test-gemini
 * 
 * OPTIMIZACIÓN: Usa cache para evitar consumir tokens en cada verificación.
 * Solo hace una llamada real a Gemini si el cache ha expirado.
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

    // Verificar si hay un cache válido
    const now = Date.now();
    if (statusCache && (now - statusCache.timestamp) < CACHE_TTL) {
      console.log("[API] ✅ Returning cached Gemini status (no tokens consumed)");
      return NextResponse.json({
        success: statusCache.success,
        message: statusCache.success ? "Gemini AI is connected and working!" : undefined,
        modelUsed: statusCache.modelUsed,
        error: statusCache.error,
        cached: true,
        timestamp: new Date(statusCache.timestamp).toISOString(),
      });
    }

    // Si el cache expiró o no existe, hacer una verificación real
    console.log("[API] Testing Gemini AI connection (consuming tokens)...");

    // Test simple con prompt básico (mínimo para reducir consumo de tokens)
    const testPrompt = "OK";

    const response = await callGemini(testPrompt, {
      temperature: 0.1,
      topP: 0.1,
      topK: 1,
      maxOutputTokens: 5, // Mínimo posible para reducir consumo
    });

    // Actualizar cache
    statusCache = {
      success: response.success,
      modelUsed: response.modelUsed,
      error: response.error,
      timestamp: now,
    };

    if (!response.success) {
      return NextResponse.json(
        {
          success: false,
          error: response.error || "Failed to connect to Gemini AI",
          modelUsed: response.modelUsed,
          cached: false,
        },
        { status: 500 }
      );
    }

    console.log(`[API] ✅ Gemini AI test successful. Model used: ${response.modelUsed}`);
    
    return NextResponse.json({
      success: true,
      message: "Gemini AI is connected and working!",
      modelUsed: response.modelUsed,
      cached: false,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("[API] Test Gemini Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to test Gemini AI",
        cached: false,
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

