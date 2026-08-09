"use client";

import { useRef, useState } from "react";
import BionicText from "@/components/BionicText";
import TTSControls from "@/components/TTSControls";
import AppearanceControls, { Theme } from "@/components/AppearanceControls";
import LevelSlider, { Level } from "@/components/LevelSlider";
import JargonDecoder from "@/components/JargonDecoder";
import ChunkedView from "@/components/ChunkedView";
import ReadingText from "@/components/ReadingText";

type SimplifyResult = {
  title: string;
  levels: Record<Level, string>;
  summary: string;
  chunks: { heading: string; bullets: string[]; estimatedReadingSeconds: number }[];
  jargon: { term: string; definition: string }[];
};

export default function Home() {
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<SimplifyResult | null>(null);

  // Appearance state
  const [theme, setTheme] = useState<Theme>("default");
  const [dyslexicFont, setDyslexicFont] = useState(false);
  const [bionic, setBionic] = useState(false);
  const [focusLine, setFocusLine] = useState(false);
  const [level, setLevel] = useState<Level>("highschool");
  const [view, setView] = useState<"full" | "chunks">("full");

  const [askQuestion, setAskQuestion] = useState("");
  const [askAnswer, setAskAnswer] = useState<string | null>(null);
  const [asking, setAsking] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const readingRef = useRef<HTMLDivElement>(null);

  const themeClass = `theme-${theme}`;

  const handleSimplify = async (text: string) => {
    setLoading(true);
    setError(null);
    setResult(null);
    setAskAnswer(null);
    try {
      const res = await fetch("/api/simplify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      setResult(data);
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitText = () => {
    if (inputText.trim().length < 20) {
      setError("Please paste at least a short paragraph.");
      return;
    }
    handleSimplify(inputText);
  };

  const handleFileUpload = async (file: File) => {
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/extract-pdf", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not read that PDF.");
      setInputText(data.text);
      await handleSimplify(data.text);
    } catch (err: any) {
      setError(err.message || "Could not process that PDF.");
      setLoading(false);
    }
  };

  const handleAsk = async () => {
    if (!askQuestion.trim() || !inputText) return;
    setAsking(true);
    setAskAnswer(null);
    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: inputText, question: askQuestion }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      setAskAnswer(data.answer);
    } catch (err: any) {
      setAskAnswer("Sorry, I couldn't answer that: " + err.message);
    } finally {
      setAsking(false);
    }
  };

  const activeText = result ? result.levels[level] : "";

  return (
    <main
      className={`min-h-screen ${themeClass} ${
        dyslexicFont ? "font-opendyslexic" : ""
      }`}
    >
      <div className="mx-auto max-w-4xl px-4 py-10">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold sm:text-4xl">
            ClearRead <span className="text-indigo-600">✦</span>
          </h1>
          <p className="mt-2 opacity-70">
            Paste any dense text or upload a PDF. Get an instantly accessible,
            simplified, readable-aloud version.
          </p>
        </header>

        {!result && (
          <div className="space-y-4 rounded-xl border border-black/10 bg-white/50 p-6 shadow-sm">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Paste a legal document, medical article, textbook chapter, or anything dense here..."
              className="h-56 w-full resize-none rounded-lg border border-black/20 bg-white p-4 text-black outline-none focus:border-indigo-500"
            />
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={handleSubmitText}
                disabled={loading}
                className="rounded-lg bg-indigo-600 px-5 py-2.5 font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
              >
                {loading ? "Simplifying..." : "✨ Make it accessible"}
              </button>
              <span className="opacity-50">or</span>
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={loading}
                className="rounded-lg border border-black/20 px-5 py-2.5 font-medium hover:bg-black/5 disabled:opacity-50"
              >
                📄 Upload PDF
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleFileUpload(f);
                }}
              />
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
          </div>
        )}

        {loading && !result && (
          <div className="mt-8 text-center opacity-70">
            Reading and simplifying your document...
          </div>
        )}

        {result && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-xl font-bold">{result.title}</h2>
              <button
                onClick={() => {
                  setResult(null);
                  setInputText("");
                }}
                className="text-sm underline opacity-70 hover:opacity-100"
              >
                ← Start over with new text
              </button>
            </div>

            <AppearanceControls
              theme={theme}
              setTheme={setTheme}
              dyslexicFont={dyslexicFont}
              setDyslexicFont={setDyslexicFont}
              bionic={bionic}
              setBionic={setBionic}
              focusLine={focusLine}
              setFocusLine={setFocusLine}
            />

            <div className="rounded-lg border border-black/10 bg-indigo-50/60 p-4">
              <h3 className="mb-1 text-sm font-semibold text-indigo-800">
                📋 Executive Summary
              </h3>
              <p>{result.summary}</p>
            </div>

            <JargonDecoder items={result.jargon} />

            <div className="flex items-center justify-between gap-4">
              <LevelSlider level={level} setLevel={setLevel} />
              <div className="flex overflow-hidden rounded-lg border border-black/20 text-sm">
                <button
                  onClick={() => setView("full")}
                  className={`px-3 py-1.5 ${
                    view === "full" ? "bg-indigo-600 text-white" : ""
                  }`}
                >
                  Full text
                </button>
                <button
                  onClick={() => setView("chunks")}
                  className={`px-3 py-1.5 ${
                    view === "chunks" ? "bg-indigo-600 text-white" : ""
                  }`}
                >
                  Chunked
                </button>
              </div>
            </div>

            <TTSControls text={activeText} />

            {view === "full" ? (
              <div
                ref={readingRef}
                className={`reading-paragraph rounded-xl border border-black/10 bg-white/40 p-6 leading-relaxed ${
                  focusLine ? "focus-line" : ""
                }`}
              >
                <p style={{ whiteSpace: "pre-wrap" }}>
                  <BionicText text={activeText} enabled={bionic} />
                </p>
              </div>
            ) : (
              <ChunkedView chunks={result.chunks} bionic={bionic} />
            )}

            <div className="space-y-3 rounded-xl border border-black/10 bg-white/40 p-6">
              <h3 className="font-semibold">💬 Ask this document</h3>
              <div className="flex gap-2">
                <input
                  value={askQuestion}
                  onChange={(e) => setAskQuestion(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAsk()}
                  placeholder="e.g. When is this due? What are the risks?"
                  className="flex-1 rounded-lg border border-black/20 bg-white px-4 py-2 text-black outline-none focus:border-indigo-500"
                />
                <button
                  onClick={handleAsk}
                  disabled={asking}
                  className="rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
                >
                  {asking ? "..." : "Ask"}
                </button>
              </div>
              {askAnswer && (
                <div className="rounded-lg bg-black/5 p-3 text-sm">
                  {askAnswer}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
