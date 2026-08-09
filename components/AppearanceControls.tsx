"use client";

export type Theme = "default" | "cream" | "dark" | "bluetint";

export default function AppearanceControls({
  theme,
  setTheme,
  dyslexicFont,
  setDyslexicFont,
  bionic,
  setBionic,
  focusLine,
  setFocusLine,
}: {
  theme: Theme;
  setTheme: (t: Theme) => void;
  dyslexicFont: boolean;
  setDyslexicFont: (v: boolean) => void;
  bionic: boolean;
  setBionic: (v: boolean) => void;
  focusLine: boolean;
  setFocusLine: (v: boolean) => void;
}) {
  const themes: { id: Theme; label: string; bg: string; fg: string }[] = [
    { id: "default", label: "Default", bg: "#ffffff", fg: "#111111" },
    { id: "cream", label: "Cream", bg: "#fbf3db", fg: "#3a3226" },
    { id: "dark", label: "Dark", bg: "#121212", fg: "#ededed" },
    { id: "bluetint", label: "Blue tint", bg: "#eaf1f8", fg: "#1f2933" },
  ];

  return (
    <div className="flex flex-wrap items-center gap-4 rounded-lg border border-black/10 bg-black/5 px-4 py-3 text-sm">
      <div className="flex items-center gap-2">
        <span className="font-medium">Theme:</span>
        {themes.map((t) => (
          <button
            key={t.id}
            onClick={() => setTheme(t.id)}
            title={t.label}
            className={`btn-pop flex h-9 w-9 items-center justify-center rounded-full border-2 text-xs font-bold ${
              theme === t.id ? "border-indigo-600 ring-2 ring-indigo-300" : "border-black/20"
            }`}
            style={{ backgroundColor: t.bg, color: t.fg }}
          >
            Aa
          </button>
        ))}
      </div>

      <ToggleChip
        label="OpenDyslexic font"
        active={dyslexicFont}
        onClick={() => setDyslexicFont(!dyslexicFont)}
      />
      <ToggleChip
        label="Bionic reading"
        active={bionic}
        onClick={() => setBionic(!bionic)}
      />
      <ToggleChip
        label="Focus line"
        active={focusLine}
        onClick={() => setFocusLine(!focusLine)}
      />
    </div>
  );
}

function ToggleChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`btn-pop rounded-full px-3 py-1.5 text-sm font-medium ${
        active
          ? "bg-indigo-600 text-white"
          : "bg-white/70 text-black/70 border border-black/20"
      }`}
    >
      {active ? "✓ " : ""}
      {label}
    </button>
  );
}