import type { Tone } from "@/lib/config";

export type Theme = {
  tone: Tone;
  bg: string;
  ink: string;
  accent: string;
  soft: string;
  muted: string;
  line: string;
  card: string;
  petals: string[];
  fontSerif: string;
  fontDisplay: string;
  fontScript: string;
};

export function makeTheme(tone: Tone, accent: string): Theme {
  const playful = tone === "playful";
  return {
    tone,
    // Sıcak fildişi kağıt zemini
    bg: playful
      ? "radial-gradient(120% 80% at 50% 0%, #fbf3e7 0%, #f4e7d4 60%, #efddc6 100%)"
      : "radial-gradient(120% 80% at 50% 0%, #f6ecdb 0%, #efe2cd 60%, #e7d6bd 100%)",
    ink: "#3a2418",
    accent,
    soft: accent + "22",
    muted: "rgba(58,36,24,0.55)",
    line: "rgba(58,36,24,0.16)",
    card: "rgba(255,255,255,0.5)",
    petals: playful
      ? ["#d4694f", "#c95b7a", "#cf9b53", "#b5683f"]
      : ["#a8755a", "#7a4a2e", "#9c6648", "#b5683f"],
    fontSerif: "var(--font-cormorant), Georgia, serif",
    fontDisplay: "var(--font-dm-serif), Georgia, serif",
    fontScript: "var(--font-allura), cursive",
  };
}
