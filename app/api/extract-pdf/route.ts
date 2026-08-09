import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 30;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded." }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // pdf-parse is CommonJS; require it dynamically to avoid build-time issues.
    const pdfParse = (await import("pdf-parse")).default;
    const data = await pdfParse(buffer);

    return NextResponse.json({ text: data.text });
  } catch (err: any) {
    console.error("extract-pdf route error:", err);
    return NextResponse.json(
      { error: err?.message || "Could not read that PDF." },
      { status: 500 }
    );
  }
}
