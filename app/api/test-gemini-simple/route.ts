import { NextRequest, NextResponse } from "next/server";
import { callGemini } from "@/lib/ai/gemini-advanced";

export const runtime = "nodejs";

/**
 * Simple test endpoint to verify Gemini API connectivity
 */
export async function GET(request: NextRequest) {
  try {
    // Check API key
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        {
          success: false,
          error: "GEMINI_API_KEY is not set",
        },
        { status: 500 }
      );
    }

    // Simple test prompt
    const testPrompt = "Say 'Hello, Gemini is working!' in JSON format: {\"message\": \"your response\"}";

    console.log("[TEST] Testing Gemini API...");
    const response = await callGemini(testPrompt, {
      temperature: 0.7,
      maxOutputTokens: 100,
    });

    if (!response.success) {
      return NextResponse.json(
        {
          success: false,
          error: response.error || "Gemini API call failed",
          modelUsed: response.modelUsed,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Gemini API is working!",
      response: response.data,
      modelUsed: response.modelUsed,
    });
  } catch (error: any) {
    console.error("[TEST] Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Unknown error",
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}

