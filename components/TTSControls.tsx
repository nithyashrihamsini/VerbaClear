"use client";

import { useEffect, useRef, useState } from "react";

export default function TTSControls({
  text,
  onBoundary,
}: {
  text: string;
  onBoundary?: (charIndex: number) => void;
}) {
  const [speaking, setSpeaking] = useState(false);
  const [paused, setPaused] = useState(false);
  const [rate, setRate] = useState(1);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const stopExisting = () => {
    window.speechSynthesis.cancel();
    setSpeaking(false);
    setPaused(false);
    if (onBoundary) onBoundary(-1);
  };

  const handlePlay = () => {
    if (!("speechSynthesis" in window)) {
      alert("Text-to-speech isn't supported in this browser.");
      return;
    }

    if (paused) {
      window.speechSynthesis.resume();
      setPaused(false);
      setSpeaking(true);
      return;
    }

    stopExisting();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = rate;
    utterance.onend = () => {
      setSpeaking(false);
      setPaused(false);
       if (onBoundary) onBoundary(-1);
    };
    utterance.onboundary = (e) => {
      if (onBoundary && e.charIndex !== undefined) {
        onBoundary(e.charIndex);
      }
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setSpeaking(true);
  };

  const handlePause = () => {
    window.speechSynthesis.pause();
    setPaused(true);
    setSpeaking(false);
  };

  const handleStop = () => {
    stopExisting();
  };

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-lg border border-black/10 bg-black/5 px-4 py-3">
      <button
        onClick={speaking ? handlePause : handlePlay}
        className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
      >
        {speaking ? "⏸ Pause" : paused ? "▶ Resume" : "▶ Read aloud"}
      </button>
      <button
        onClick={handleStop}
        className="rounded-md border border-black/20 px-4 py-2 text-sm font-medium hover:bg-black/5"
      >
        ⏹ Stop
      </button>
      <label className="flex items-center gap-2 text-sm">
        Speed: {rate.toFixed(2)}x
        <input
          type="range"
          min={0.75}
          max={2}
          step={0.25}
          value={rate}
          onChange={(e) => setRate(parseFloat(e.target.value))}
          className="w-32"
        />
      </label>
    </div>
  );
}
