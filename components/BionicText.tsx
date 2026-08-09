"use client";

import React from "react";

function bionicWord(word: string, key: number) {
  // Keep punctuation intact, bold roughly the first 40-50% of the letters.
  const match = word.match(/^([a-zA-Z']+)(.*)$/);
  if (!match) return <span key={key}>{word} </span>;

  const [, letters, rest] = match;
  if (letters.length <= 1) {
    return (
      <span key={key}>
        <span className="bionic-bold">{letters}</span>
        {rest}{" "}
      </span>
    );
  }

  const boldLen = Math.max(1, Math.ceil(letters.length * 0.5));
  const boldPart = letters.slice(0, boldLen);
  const restPart = letters.slice(boldLen);

  return (
    <span key={key}>
      <span className="bionic-bold">{boldPart}</span>
      {restPart}
      {rest}{" "}
    </span>
  );
}

export default function BionicText({
  text,
  enabled,
}: {
  text: string;
  enabled: boolean;
}) {
  if (!enabled) return <>{text}</>;

  const words = text.split(/(\s+)/).filter((w) => w.trim().length > 0);

  return <>{words.map((w, i) => bionicWord(w, i))}</>;
}
