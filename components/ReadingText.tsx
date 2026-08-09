"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type WordSpan = { text: string; start: number; end: number };

function splitWords(text: string): WordSpan[] {
  const words: WordSpan[] = [];
  const regex = /\S+/g;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(text)) !== null) {
    words.push({ text: match[0], start: match.index, end: match.index + match[0].length });
  }
  return words;
}

function BionicWord({ word }: { word: string }) {
  const match = word.match(/^([a-zA-Z']+)(.*)$/);
  if (!match) return <>{word}</>;
  const [, letters, rest] = match;
  if (letters.length <= 1) {
    return (
      <>
        <span className="bionic-bold">{letters}</span>
        {rest}
      </>
    );
  }
  const boldLen = Math.max(1, Math.ceil(letters.length * 0.5));
  return (
    <>
      <span className="bionic-bold">{letters.slice(0, boldLen)}</span>
      {letters.slice(boldLen)}
      {rest}
    </>
  );
}

export default function ReadingText({
  text,
  bionic,
  focusLine,
  activeCharIndex,
}: {
  text: string;
  bionic: boolean;
  focusLine: boolean;
  activeCharIndex: number | null;
}) {
  const words = useMemo(() => splitWords(text), [text]);
  const containerRef = useRef<HTMLDivElement>(null);
  const activeWordRef = useRef<HTMLSpanElement>(null);
  const [topOffset, setTopOffset] = useState(0);

  const activeIndex = useMemo(() => {
    if (activeCharIndex === null || activeCharIndex < 0) return -1;
    return words.findIndex((w) => activeCharIndex >= w.start && activeCharIndex < w.end);
  }, [activeCharIndex, words]);

  useEffect(() => {
    if (focusLine && activeIndex >= 0 && activeWordRef.current && containerRef.current) {
      const wordRect = activeWordRef.current.getBoundingClientRect();
      const containerRect = containerRef.current.getBoundingClientRect();
      setTopOffset(wordRect.top - containerRect.top);
      activeWordRef.current.scrollIntoView({ block: "center", behavior: "smooth" });
    }
  }, [activeIndex, focusLine]);

  return (
    <div
      ref={containerRef}
      className={`relative rounded-xl border border-black/10 bg-white/40 p-6 leading-relaxed reading-paragraph ${
        focusLine ? "focus-line" : ""
      }`}
      style={{ ["--focus-top" as any]: `${topOffset}px` }}
    >
      <p style={{ whiteSpace: "pre-wrap" }}>
        {words.map((w, i) => (
          <span
            key={i}
            ref={i === activeIndex ? activeWordRef : undefined}
            className={
              i === activeIndex
                ? "rounded bg-yellow-300/70 px-0.5 transition-colors"
                : "transition-colors"
            }
          >
            {bionic ? <BionicWord word={w.text} /> : w.text}
            {" "}
          </span>
        ))}
      </p>
    </div>
  );
}