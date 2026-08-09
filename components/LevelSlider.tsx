"use client";

export type Level = "original" | "highschool" | "grade5" | "eli10";

const LEVELS: { id: Level; label: string }[] = [
  { id: "original", label: "Original" },
  { id: "highschool", label: "High School" },
  { id: "grade5", label: "5th Grade" },
  { id: "eli10", label: "ELI10 + Analogy" },
];

export default function LevelSlider({
  level,
  setLevel,
}: {
  level: Level;
  setLevel: (l: Level) => void;
}) {
  const index = LEVELS.findIndex((l) => l.id === level);

  return (
    <div className="w-full max-w-xl">
      <input
        type="range"
        min={0}
        max={LEVELS.length - 1}
        step={1}
        value={index}
        onChange={(e) => setLevel(LEVELS[parseInt(e.target.value)].id)}
        className="w-full accent-indigo-600"
      />
      <div className="mt-1 flex justify-between text-xs font-medium opacity-70">
        {LEVELS.map((l) => (
          <span
            key={l.id}
            className={l.id === level ? "text-indigo-600 font-bold" : ""}
          >
            {l.label}
          </span>
        ))}
      </div>
    </div>
  );
}
