"use client";

import type { Theme } from "./theme";

// İnce kağıt dokusu (SVG noise) — tüm ekranların üstüne yayılır.
export function PaperGrain({ opacity = 0.06 }: { opacity?: number }) {
  const svg = encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='2'/></filter><rect width='100%' height='100%' filter='url(#n)'/></svg>`
  );
  return (
    <div
      aria-hidden
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        opacity,
        mixBlendMode: "multiply",
        backgroundImage: `url("data:image/svg+xml,${svg}")`,
      }}
    />
  );
}

// Yavaşça düşen yapraklar / yaprakçıklar.
export function Petals({ theme }: { theme: Theme }) {
  const items = Array.from({ length: 9 });
  return (
    <div
      aria-hidden
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
      }}
    >
      {items.map((_, i) => {
        const color = theme.petals[i % theme.petals.length];
        const left = (i * 11 + 5) % 100;
        const dur = 9 + (i % 5) * 2.5;
        const delay = -(i * 1.7);
        const size = 7 + (i % 4) * 3;
        return (
          <span
            key={i}
            style={{
              position: "absolute",
              top: 0,
              left: `${left}%`,
              width: size,
              height: size * 1.4,
              background: color,
              opacity: 0.45,
              borderRadius: "0 70% 0 70%",
              animation: `mw-fall ${dur}s linear ${delay}s infinite, mw-sway ${
                dur / 3
              }s ease-in-out ${delay}s infinite alternate`,
            }}
          />
        );
      })}
    </div>
  );
}
