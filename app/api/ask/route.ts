import { NextRequest, NextResponse } from "next/server";
import { genAI, MODEL } from "@/lib/gemini";
import { buildAskPrompt } from "@/lib/prompts";

export const runtime = "nodejs";
export const maxDuration = 30;

export async function POST(req: NextRequest) {
  try {
    const { text, question } = await req.json();

    if (!text || !question) {
      return NextResponse.json(
        { error: "Missing document text or question." },
        { status: 400 }
      );
    }

    const response = await genAI.models.generateContent({
      model: MODEL,
      contents: buildAskPrompt(text.slice(0, 15000), question),
    });

    const answer = (response.text || "").trim();

    return NextResponse.json({ answer });
  } catch (err: any) {
    console.error("ask route error:", err);
    return NextResponse.json(
      { error: err?.message || "Something went wrong answering that." },
      { status: 500 }
    );
  }
}