"use client";

import BionicText from "./BionicText";

export type Chunk = {
  heading: string;
  bullets: string[];
  estimatedReadingSeconds: number;
};

export default function ChunkedView({
  chunks,
  bionic,
}: {
  chunks: Chunk[];
  bionic: boolean;
}) {
  if (!chunks || chunks.length === 0) return null;

  return (
    <div className="space-y-4">
      {chunks.map((chunk, i) => (
        <div
          key={i}
          className="rounded-lg border border-black/10 bg-white/40 p-4"
        >
          <div className="mb-2 flex items-center justify-between">
            <h4 className="font-semibold">
              <BionicText text={chunk.heading} enabled={bionic} />
            </h4>
            <span className="text-xs opacity-60">
              ~{chunk.estimatedReadingSeconds}s read
            </span>
          </div>
          <ul className="list-disc space-y-1 pl-5">
            {chunk.bullets.map((b, j) => (
              <li key={j}>
                <BionicText text={b} enabled={bionic} />
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
