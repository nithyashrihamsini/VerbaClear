"use client";

import { useState } from "react";

export type JargonItem = { term: string; definition: string };

export default function JargonDecoder({ items }: { items: JargonItem[] }) {
  const [open, setOpen] = useState<string | null>(null);

  if (!items || items.length === 0) return null;

  return (
    <div className="rounded-lg border border-black/10 bg-black/5 p-4">
      <h3 className="mb-2 text-sm font-semibold">🔍 Jargon Decoder</h3>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <div key={item.term} className="relative">
            <button
              onClick={() => setOpen(open === item.term ? null : item.term)}
              className="rounded-full border border-indigo-300 bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-800 hover:bg-indigo-100"
            >
              {item.term}
            </button>
            {open === item.term && (
              <div className="absolute left-0 top-full z-10 mt-2 w-64 rounded-md border border-black/10 bg-white p-3 text-sm text-black shadow-lg">
                {item.definition}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
