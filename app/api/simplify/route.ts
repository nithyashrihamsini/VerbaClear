import { NextRequest, NextResponse } from "next/server";
import { genAI, MODEL } from "@/lib/gemini";
import { buildSimplifyPrompt } from "@/lib/prompts";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();

    if (!text || typeof text !== "string" || text.trim().length < 20) {
      return NextResponse.json(
        { error: "Please provide at least a short paragraph of text." },
        { status: 400 }
      );
    }

    const trimmed = text.slice(0, 15000);

    const response = await genAI.models.generateContent({
      model: MODEL,
      contents: buildSimplifyPrompt(trimmed),
      config: {
        responseMimeType: "application/json",
        maxOutputTokens: 8192,
      },
    });

    const raw = (response.text || "").trim();
    const cleaned = raw.replace(/^```json\s*|^```\s*|```$/g, "").trim();

    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch (e) {
      console.error("Failed to parse model output:", cleaned);
      return NextResponse.json(
        { error: "The model returned an unexpected format. Please try again." },
        { status: 502 }
      );
    }

    return NextResponse.json(parsed);
  } catch (err: any) {
    console.error("simplify route error:", err);
    return NextResponse.json(
      { error: err?.message || "Something went wrong simplifying this text." },
      { status: 500 }
    );
  }
}