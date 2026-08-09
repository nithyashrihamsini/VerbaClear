"use client";

import { useRef, useState } from "react";
import TTSControls from "@/components/TTSControls";
import AppearanceControls, { Theme } from "@/components/AppearanceControls";
import LevelSlider, { Level } from "@/components/LevelSlider";
import JargonDecoder from "@/components/JargonDecoder";
import ChunkedView from "@/components/ChunkedView";
import ReadingText from "@/components/ReadingText";

const SAMPLE_TEXT = `Patient Informed Consent & Statutory Disclosure Notice

Pursuant to Section 12(a) of the Healthcare Compliance Directive, the undersigned patient or designated legal proxy hereby acknowledges receipt of the clinical prognosis and associated pharmacological risks. Notwithstanding prior verbal communications, the therapeutic intervention may induce transient adverse events including, but not limited to, somnolence, vertigo, or mild gastrointestinal distress.

By executing this document, the patient indemnifies the facility against non-negligent clinical outcomes, confirming that all prophylactic measures and post-procedural contraindications have been reviewed in full prior to administration.`;

type SimplifyResult = {
  title: string;
  levels: Record<Level, string>;
  summary: string;
  chunks: { heading: string; bullets: string[]; estimatedReadingSeconds: number }[];
  jargon: { term: string; definition: string }[];
};

function countWords(text: string) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export default function Home() {
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<SimplifyResult | null>(null);

  const [theme, setTheme] = useState<Theme>("default");
  const [dyslexicFont, setDyslexicFont] = useState(false);
  const [bionic, setBionic] = useState(false);
  const [focusLine, setFocusLine] = useState(false);
  const [level, setLevel] = useState<Level>("highschool");
  const [view, setView] = useState<"full" | "chunks">("full");

  const [askQuestion, setAskQuestion] = useState("");
  const [askAnswer, setAskAnswer] = useState<string | null>(null);
  const [asking, setAsking] = useState(false);

  const [activeCharIndex, setActiveCharIndex] = useState<number | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleTrySample = () => {
    setInputText(SAMPLE_TEXT);
    handleSimplify(SAMPLE_TEXT);
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
  const originalWordCount = result ? countWords(result.levels.original) : 0;
  const simplifiedWordCount = result ? countWords(activeText) : 0;
  const reductionPct =
    originalWordCount > 0
      ? Math.max(
          0,
          Math.round(
            ((originalWordCount - simplifiedWordCount) / originalWordCount) * 100
          )
        )
      : 0;

  return (
    <main
      className={`relative min-h-screen overflow-hidden ${themeClass} ${
        dyslexicFont ? "font-opendyslexic" : ""
      }`}
    >
      {/* Animated hero background blobs */}
      <div className="pointer-events-none absolute inset-0 -z-0 overflow-hidden">
        <div className="animate-blob absolute -left-20 -top-20 h-72 w-72 rounded-full bg-indigo-300/40 blur-3xl" />
        <div className="animate-blob animation-delay-2000 absolute -right-10 top-10 h-72 w-72 rounded-full bg-pink-300/30 blur-3xl" />
        <div className="animate-blob animation-delay-4000 absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-sky-300/30 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl px-4 py-10">
        <header className="mb-8 text-center animate-fade-in-up">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            VerbaClear <span className="text-indigo-600">✦</span>
          </h1>
          <p className="mt-2 opacity-70">
            Paste any dense text or upload a PDF. Get an instantly accessible,
            simplified, readable-aloud version.
          </p>
        </header>

        {!result && (
          <div className="animate-fade-in-up space-y-4 rounded-xl border border-black/10 bg-white/50 p-6 shadow-sm backdrop-blur">
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
                className="btn-pop rounded-lg bg-indigo-600 px-5 py-2.5 font-medium text-white shadow-sm hover:bg-indigo-700 disabled:opacity-50"
              >
                {loading ? "Simplifying..." : "✨ Make it accessible"}
              </button>
              <span className="opacity-50">or</span>
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={loading}
                className="btn-pop rounded-lg border border-black/20 px-5 py-2.5 font-medium hover:bg-black/5 disabled:opacity-50"
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
              <span className="opacity-50">or</span>
              <button
                onClick={handleTrySample}
                disabled={loading}
                className="btn-pop rounded-lg border border-indigo-300 bg-indigo-50 px-5 py-2.5 font-medium text-indigo-700 hover:bg-indigo-100 disabled:opacity-50"
              >
                🎬 Try a sample document
              </button>
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
          </div>
        )}

        {loading && !result && (
          <div className="mt-8 space-y-3 animate-fade-in-up">
            <p className="text-center text-sm opacity-70">
              Reading and simplifying your document...
            </p>
            <div className="skeleton h-5 w-3/4 mx-auto" />
            <div className="skeleton h-5 w-full" />
            <div className="skeleton h-5 w-5/6" />
            <div className="skeleton h-5 w-2/3" />
            <div className="skeleton h-24 w-full mt-4" />
          </div>
        )}

        {result && (
          <div className="animate-fade-in-up space-y-6">
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

            <div className="flex flex-wrap gap-3 text-sm">
              <div className="rounded-full bg-indigo-600 px-4 py-1.5 font-medium text-white">
                {originalWordCount} → {simplifiedWordCount} words
              </div>
              {reductionPct > 0 && (
                <div className="rounded-full bg-emerald-100 px-4 py-1.5 font-medium text-emerald-800">
                  {reductionPct}% shorter to read
                </div>
              )}
              <div className="rounded-full bg-black/5 px-4 py-1.5 font-medium">
                {result.chunks.length} sections · {result.jargon.length} terms decoded
              </div>
            </div>

            <div className="sticky top-2 z-20 space-y-3 rounded-xl bg-white/70 py-2 backdrop-blur">
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
              <TTSControls text={activeText} onBoundary={setActiveCharIndex} />
            </div>

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
                  className={`px-3 py-1.5 transition-colors ${
                    view === "full" ? "bg-indigo-600 text-white" : ""
                  }`}
                >
                  Full text
                </button>
                <button
                  onClick={() => setView("chunks")}
                  className={`px-3 py-1.5 transition-colors ${
                    view === "chunks" ? "bg-indigo-600 text-white" : ""
                  }`}
                >
                  Chunked
                </button>
              </div>
            </div>

            {view === "full" ? (
              <ReadingText
                text={activeText}
                bionic={bionic}
                focusLine={focusLine}
                activeCharIndex={activeCharIndex}
              />
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
                  className="btn-pop rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
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