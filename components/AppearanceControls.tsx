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
  const themes: { id: Theme; label: string; swatch: string }[] = [
    { id: "default", label: "Default", swatch: "#ffffff" },
    { id: "cream", label: "Cream", swatch: "#fbf3db" },
    { id: "dark", label: "Dark", swatch: "#121212" },
    { id: "bluetint", label: "Blue tint", swatch: "#eaf1f8" },
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
            className={`h-7 w-7 rounded-full border-2 ${
              theme === t.id ? "border-indigo-600" : "border-black/20"
            }`}
            style={{ backgroundColor: t.swatch }}
          />
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
      className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
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
