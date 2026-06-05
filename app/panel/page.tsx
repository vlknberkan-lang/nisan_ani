"use client";

import { useState } from "react";
import { eventConfig } from "@/lib/config";
import { makeTheme } from "@/components/memory/theme";
import { useMemories, MemoryCard } from "@/components/memory/Wall";

export default function PanelPage() {
  const theme = makeTheme(eventConfig.tone, eventConfig.accent);
  const [unlocked, setUnlocked] = useState(false);
  const [pin, setPin] = useState("");
  const [wrong, setWrong] = useState(false);

  function tryUnlock(e: React.FormEvent) {
    e.preventDefault();
    if (pin === eventConfig.panelPin) {
      setUnlocked(true);
      setWrong(false);
    } else {
      setWrong(true);
    }
  }

  const baseStyle: React.CSSProperties = {
    minHeight: "100dvh",
    background: theme.bg,
    color: theme.ink,
    fontFamily: theme.fontSerif,
  };

  if (!unlocked) {
    return (
      <div
        style={{
          ...baseStyle,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 24,
        }}
      >
        <form onSubmit={tryUnlock} style={{ width: "100%", maxWidth: 340, textAlign: "center" }}>
          <h1 style={{ fontFamily: theme.fontDisplay, fontSize: 30, marginBottom: 6 }}>
            Çift Paneli
          </h1>
          <p style={{ color: theme.muted, marginBottom: 22 }}>
            Bırakılan tüm anıları görmek için kodu gir.
          </p>
          <input
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            type="password"
            inputMode="numeric"
            placeholder="Kod"
            autoFocus
            style={{
              width: "100%",
              padding: "14px 16px",
              textAlign: "center",
              letterSpacing: "0.3em",
              background: "rgba(255,255,255,0.6)",
              border: `1px solid ${wrong ? "#c0392b" : theme.line}`,
              borderRadius: 14,
              fontFamily: theme.fontSerif,
              fontSize: 20,
              color: theme.ink,
              outline: "none",
            }}
          />
          {wrong && (
            <p style={{ color: "#c0392b", fontSize: 14, marginTop: 8 }}>
              Kod hatalı, tekrar dene.
            </p>
          )}
          <button
            type="submit"
            style={{
              marginTop: 16,
              width: "100%",
              padding: "14px 24px",
              background: theme.accent,
              color: "#fff",
              border: "none",
              borderRadius: 999,
              fontFamily: theme.fontSerif,
              fontSize: 17,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Gir
          </button>
        </form>
      </div>
    );
  }

  return <PanelContent theme={theme} baseStyle={baseStyle} />;
}

function PanelContent({
  theme,
  baseStyle,
}: {
  theme: ReturnType<typeof makeTheme>;
  baseStyle: React.CSSProperties;
}) {
  const { memories, loading, error } = useMemories();

  const counts = {
    photo: memories.filter((m) => m.media_type === "photo").length,
    audio: memories.filter((m) => m.media_type === "audio").length,
    video: memories.filter((m) => m.media_type === "video").length,
    note: memories.filter((m) => m.media_type === "none").length,
  };

  return (
    <div style={{ ...baseStyle, padding: "32px 20px 48px" }}>
      <div style={{ maxWidth: 880, margin: "0 auto" }}>
        <h1 style={{ fontFamily: theme.fontDisplay, fontSize: 34 }}>
          {eventConfig.names} · Tüm Anılar
        </h1>
        <p style={{ color: theme.muted, marginTop: 6, marginBottom: 18 }}>
          {memories.length} anı · {counts.photo} foto · {counts.audio} ses ·{" "}
          {counts.video} video · {counts.note} not
        </p>

        {loading && <p style={{ color: theme.muted }}>Yükleniyor…</p>}
        {error && <p style={{ color: "#c0392b" }}>Anılar yüklenemedi.</p>}

        <div
          style={{
            columnGap: 16,
          }}
          className="panel-cols"
        >
          {memories.map((m) => (
            <MemoryCard key={m.id} theme={theme} m={m} />
          ))}
        </div>
      </div>

      <style>{`
        .panel-cols { column-count: 1; }
        @media (min-width: 600px) { .panel-cols { column-count: 2; } }
        @media (min-width: 900px) { .panel-cols { column-count: 3; } }
      `}</style>
    </div>
  );
}
