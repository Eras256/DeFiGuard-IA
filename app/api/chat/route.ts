import { NextRequest, NextResponse } from "next/server";
import { google } from "@ai-sdk/google";
import { generateText } from "ai";

export const runtime = "nodejs";

// Configure API key for AI SDK (use GEMINI_API_KEY if GOOGLE_GENERATIVE_AI_API_KEY is not available)
if (typeof process !== 'undefined' && process.env) {
  if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY && process.env.GEMINI_API_KEY) {
    process.env.GOOGLE_GENERATIVE_AI_API_KEY = process.env.GEMINI_API_KEY;
  }
}

// System prompt for DeFiGuard AI chatbot
const SYSTEM_PROMPT = `You are DeFiGuard AI, an expert smart contract security auditor assistant powered by Gemini AI + MCP Architecture.

Your role is to help users understand:
- Smart contract security best practices
- Common vulnerabilities (reentrancy, overflow, access control, etc.)
- How to use DeFiGuard AI platform
- Security analysis concepts
- Blockchain and Web3 security

You have access to:
- Gemini AI + MCP Architecture for contract analysis
- Historical exploit data
- Static analysis tools (Slither)
- Blockchain data analysis

Be helpful, professional, and concise. Always provide accurate information about smart contract security.
If asked about analyzing a contract, guide users to use the audit page.
If asked about specific vulnerabilities, provide detailed explanations with examples when possible.

Keep responses clear and actionable.`;

export async function POST(request: NextRequest) {
  try {
    // Verify API key
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        {
          success: false,
          error: "Gemini API key is not configured",
        },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { message, conversationHistory = [] } = body;

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { success: false, error: "Message is required" },
        { status: 400 }
      );
    }

    // Build conversation history for context
    const messages = [
      { role: "system" as const, content: SYSTEM_PROMPT },
      ...conversationHistory.slice(-10), // Keep last 10 messages for context
      { role: "user" as const, content: message },
    ];

    console.log("[Chat API] Processing message with Gemini...");

    // Generate response using Gemini
    const result = await generateText({
      model: google("gemini-2.5-flash"),
      messages,
      temperature: 0.7,
    });

    console.log("[Chat API] Response generated successfully");

    return NextResponse.json({
      success: true,
      response: result.text,
      usage: result.usage,
    });
  } catch (error: any) {
    console.error("[Chat API] Error:", error);
    
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to generate response",
      },
      { status: 500 }
    );
  }
}

