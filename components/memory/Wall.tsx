"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Theme } from "./theme";

export type Memory = {
  id: string;
  created_at: string;
  guest_name: string | null;
  message: string | null;
  media_url: string | null;
  media_type: "photo" | "audio" | "video" | "none";
};

export function useMemories(refreshKey: number = 0) {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    const supabase = createClient();
    supabase
      .from("memories")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (!active) return;
        if (error) setError(true);
        setMemories((data as Memory[]) ?? []);
        setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [refreshKey]);

  return { memories, loading, error };
}

function fmt(iso: string) {
  return new Date(iso).toLocaleString("tr-TR", {
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function MemoryCard({ theme, m }: { theme: Theme; m: Memory }) {
  return (
    <div
      style={{
        breakInside: "avoid",
        marginBottom: 16,
        background: theme.card,
        border: `1px solid ${theme.line}`,
        borderRadius: 18,
        padding: 14,
      }}
    >
      {m.media_type === "photo" && m.media_url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={m.media_url}
          alt=""
          style={{ width: "100%", borderRadius: 12, marginBottom: 10, objectFit: "cover" }}
        />
      )}
      {m.media_type === "video" && m.media_url && (
        <video src={m.media_url} controls style={{ width: "100%", borderRadius: 12, marginBottom: 10 }} />
      )}
      {m.media_type === "audio" && m.media_url && (
        <audio src={m.media_url} controls style={{ width: "100%", marginBottom: 10 }} />
      )}
      {m.message && (
        <p style={{ fontFamily: theme.fontSerif, fontSize: 18, color: theme.ink, lineHeight: 1.45 }}>
          {m.message}
        </p>
      )}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          marginTop: 10,
          fontFamily: theme.fontSerif,
          fontSize: 13,
        }}
      >
        <span style={{ color: theme.accent, fontWeight: 600 }}>
          {m.guest_name || "Bir misafir"}
        </span>
        <span style={{ color: theme.muted }}>{fmt(m.created_at)}</span>
      </div>
    </div>
  );
}

export function Wall({
  theme,
  refreshKey,
  onBack,
}: {
  theme: Theme;
  refreshKey: number;
  onBack: () => void;
}) {
  const { memories, loading, error } = useMemories(refreshKey);

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", padding: "36px 22px 24px", overflowY: "auto" }}>
      <button
        onClick={onBack}
        style={{
          background: "transparent",
          border: "none",
          color: theme.muted,
          fontFamily: theme.fontSerif,
          fontSize: 16,
          cursor: "pointer",
          alignSelf: "flex-start",
        }}
      >
        ← Geri
      </button>

      <h2 style={{ fontFamily: theme.fontDisplay, fontSize: 30, color: theme.ink, margin: "14px 0 4px" }}>
        Anı Duvarı
      </h2>
      <p style={{ fontFamily: theme.fontSerif, fontSize: 16, color: theme.muted, marginBottom: 20 }}>
        {memories.length > 0 ? `${memories.length} anı bırakıldı` : "Henüz anı yok"}
      </p>

      {loading && <p style={{ fontFamily: theme.fontSerif, color: theme.muted }}>Yükleniyor…</p>}
      {error && (
        <p style={{ fontFamily: theme.fontSerif, color: "#c0392b" }}>
          Anılar yüklenemedi.
        </p>
      )}

      <div style={{ columnCount: 1, columnGap: 16 }}>
        {memories.map((m) => (
          <MemoryCard key={m.id} theme={theme} m={m} />
        ))}
      </div>
    </div>
  );
}
