"use client";

import { useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { MediaType } from "@/lib/config";
import type { Theme } from "./theme";
import { Petals } from "./Decor";

// ── Ortak buton ────────────────────────────────────────────────
function PrimaryButton({
  theme,
  children,
  onClick,
  type = "button",
  disabled,
}: {
  theme: Theme;
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        width: "100%",
        padding: "16px 24px",
        background: theme.accent,
        color: "#fff",
        border: "none",
        borderRadius: 999,
        fontFamily: theme.fontSerif,
        fontSize: 19,
        fontWeight: 600,
        letterSpacing: "0.04em",
        cursor: disabled ? "default" : "pointer",
        opacity: disabled ? 0.6 : 1,
        boxShadow: `0 12px 28px ${theme.accent}44`,
        transition: "transform .15s, opacity .15s",
      }}
    >
      {children}
    </button>
  );
}

function GhostButton({
  theme,
  children,
  onClick,
}: {
  theme: Theme;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        background: "transparent",
        border: "none",
        color: theme.muted,
        fontFamily: theme.fontSerif,
        fontSize: 16,
        cursor: "pointer",
        padding: "8px 4px",
      }}
    >
      {children}
    </button>
  );
}

const screenWrap: React.CSSProperties = {
  height: "100%",
  display: "flex",
  flexDirection: "column",
  padding: "40px 28px 32px",
  position: "relative",
  overflowY: "auto",
};

// ════════════════════════════════════════════════════════════════
//  KARŞILAMA
// ════════════════════════════════════════════════════════════════
export function Welcome({
  theme,
  names,
  headline,
  count,
  onStart,
  onSecret,
}: {
  theme: Theme;
  names: string;
  headline: string;
  count: number;
  onStart: () => void;
  onSecret: () => void;
}) {
  const taps = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Gizli erişim: isimlere arka arkaya 3 dokunuş → çift paneli
  function secretTap() {
    taps.current += 1;
    if (timer.current) clearTimeout(timer.current);
    if (taps.current >= 3) {
      taps.current = 0;
      onSecret();
      return;
    }
    timer.current = setTimeout(() => (taps.current = 0), 700);
  }

  return (
    <div style={{ ...screenWrap, justifyContent: "center", textAlign: "center" }}>
      <Petals theme={theme} />

      <div style={{ position: "relative", zIndex: 1 }}>
        <p
          style={{
            fontFamily: theme.fontSerif,
            fontSize: 13,
            letterSpacing: "0.42em",
            textTransform: "uppercase",
            color: theme.accent,
            marginBottom: 18,
          }}
        >
          Anı Duvarı
        </p>

        <h1
          onClick={secretTap}
          style={{
            fontFamily: theme.fontScript,
            fontSize: 64,
            lineHeight: 1.05,
            color: theme.ink,
            marginBottom: 6,
            cursor: "default",
            userSelect: "none",
          }}
        >
          {names}
        </h1>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 14,
            color: theme.accent,
            margin: "10px 0 26px",
          }}
        >
          <span style={{ height: 1, width: 46, background: theme.line }} />
          <span style={{ fontSize: 18 }}>♥</span>
          <span style={{ height: 1, width: 46, background: theme.line }} />
        </div>

        <p
          style={{
            fontFamily: theme.fontSerif,
            fontSize: 19,
            lineHeight: 1.55,
            color: theme.muted,
            maxWidth: 320,
            margin: "0 auto 36px",
          }}
        >
          {headline}
        </p>

        <PrimaryButton theme={theme} onClick={onStart}>
          Anı Bırak ♥
        </PrimaryButton>

        <p
          style={{
            fontFamily: theme.fontSerif,
            fontSize: 14,
            color: theme.muted,
            marginTop: 18,
          }}
        >
          {count > 0
            ? `Şimdiye dek ${count} güzel anı bırakıldı`
            : "İlk anıyı sen bırak"}
        </p>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
//  TÜR SEÇİMİ
// ════════════════════════════════════════════════════════════════
const TYPES: { key: MediaType | "note"; label: string; emoji: string; desc: string }[] = [
  { key: "note", label: "Birkaç Satır", emoji: "✍️", desc: "Bir dilek, bir anı" },
  { key: "photo", label: "Fotoğraf", emoji: "📷", desc: "Bir kare yakala" },
  { key: "audio", label: "Sesli Mesaj", emoji: "🎙️", desc: "Sesini bırak" },
  { key: "video", label: "Video", emoji: "🎥", desc: "Kısa bir video" },
];

export function PickType({
  theme,
  onPick,
  onBack,
}: {
  theme: Theme;
  onPick: (t: MediaType | "note") => void;
  onBack: () => void;
}) {
  return (
    <div style={screenWrap}>
      <GhostButton theme={theme} onClick={onBack}>
        ← Geri
      </GhostButton>

      <h2
        style={{
          fontFamily: theme.fontDisplay,
          fontSize: 32,
          color: theme.ink,
          margin: "18px 0 4px",
        }}
      >
        Nasıl bırakmak istersin?
      </h2>
      <p
        style={{
          fontFamily: theme.fontSerif,
          fontSize: 17,
          color: theme.muted,
          marginBottom: 26,
        }}
      >
        Bir tane seç — sonra birkaç tane daha bırakabilirsin.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {TYPES.map((t) => (
          <button
            key={t.key}
            onClick={() => onPick(t.key)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              padding: "18px 20px",
              background: theme.card,
              border: `1px solid ${theme.line}`,
              borderRadius: 20,
              cursor: "pointer",
              textAlign: "left",
            }}
          >
            <span style={{ fontSize: 28 }}>{t.emoji}</span>
            <span>
              <span
                style={{
                  display: "block",
                  fontFamily: theme.fontDisplay,
                  fontSize: 21,
                  color: theme.ink,
                }}
              >
                {t.label}
              </span>
              <span
                style={{
                  fontFamily: theme.fontSerif,
                  fontSize: 15,
                  color: theme.muted,
                }}
              >
                {t.desc}
              </span>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
//  KAYIT (Capture)
// ════════════════════════════════════════════════════════════════
const inputStyle = (theme: Theme): React.CSSProperties => ({
  width: "100%",
  padding: "14px 16px",
  background: "rgba(255,255,255,0.55)",
  border: `1px solid ${theme.line}`,
  borderRadius: 16,
  fontFamily: theme.fontSerif,
  fontSize: 18,
  color: theme.ink,
  outline: "none",
});

export function Capture({
  theme,
  type,
  onBack,
  onSaved,
}: {
  theme: Theme;
  type: MediaType | "note";
  onBack: () => void;
  onSaved: () => void;
}) {
  const [guestName, setGuestName] = useState("");
  const [message, setMessage] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [recording, setRecording] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const mediaType: MediaType = type === "note" ? "none" : type;

  function pickFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setPreviewUrl(URL.createObjectURL(f));
  }

  // Cihaza göre desteklenen ses formatını seç (iOS Safari webm desteklemez → mp4)
  function pickAudioMime(): string {
    const candidates = ["audio/webm", "audio/mp4", "audio/ogg", "audio/aac"];
    const supported =
      typeof MediaRecorder !== "undefined" &&
      typeof MediaRecorder.isTypeSupported === "function";
    if (!supported) return "";
    return candidates.find((t) => MediaRecorder.isTypeSupported(t)) || "";
  }

  function extFor(mime: string): string {
    if (mime.includes("webm")) return "webm";
    if (mime.includes("mp4") || mime.includes("aac")) return "m4a";
    if (mime.includes("ogg")) return "ogg";
    return "webm";
  }

  async function startRec() {
    setError("");
    try {
      if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === "undefined") {
        setError(
          "Bu tarayıcı ses kaydını desteklemiyor. Aşağıdan hazır bir ses dosyası yükleyebilirsin."
        );
        return;
      }
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mime = pickAudioMime();
      const rec = mime ? new MediaRecorder(stream, { mimeType: mime }) : new MediaRecorder(stream);
      chunksRef.current = [];
      rec.ondataavailable = (ev) => ev.data.size && chunksRef.current.push(ev.data);
      rec.onstop = () => {
        const outMime = rec.mimeType || mime || "audio/webm";
        const blob = new Blob(chunksRef.current, { type: outMime });
        const ext = extFor(outMime);
        setFile(new File([blob], `ses-${Date.now()}.${ext}`, { type: outMime }));
        setPreviewUrl(URL.createObjectURL(blob));
        stream.getTracks().forEach((t) => t.stop());
      };
      rec.start();
      recorderRef.current = rec;
      setRecording(true);
    } catch (e) {
      const err = e as DOMException;
      if (err?.name === "NotAllowedError" || err?.name === "SecurityError") {
        setError("Mikrofon izni verilmedi. Tarayıcı ayarlarından izin verip tekrar dene.");
      } else if (err?.name === "NotFoundError") {
        setError("Mikrofon bulunamadı.");
      } else {
        setError(
          "Ses kaydı başlatılamadı. Aşağıdan hazır bir ses dosyası yükleyebilirsin."
        );
      }
    }
  }

  function stopRec() {
    recorderRef.current?.stop();
    setRecording(false);
  }

  async function save() {
    setError("");
    if (type === "note" && !message.trim()) {
      setError("Lütfen birkaç satır yaz.");
      return;
    }
    if (type !== "note" && !file) {
      setError("Lütfen bir dosya ekle ya da kaydet.");
      return;
    }
    setBusy(true);
    try {
      const supabase = createClient();
      let mediaUrl: string | null = null;
      if (file) {
        const ext = file.name.split(".").pop() || "dat";
        const path = `${mediaType}/${crypto.randomUUID()}.${ext}`;
        const up = await supabase.storage.from("anilar").upload(path, file);
        if (up.error) throw up.error;
        mediaUrl = supabase.storage.from("anilar").getPublicUrl(path).data.publicUrl;
      }
      const ins = await supabase.from("memories").insert({
        guest_name: guestName.trim() || null,
        message: message.trim() || null,
        media_url: mediaUrl,
        media_type: mediaType,
      });
      if (ins.error) throw ins.error;
      onSaved();
    } catch (e) {
      console.error(e);
      setError("Kaydedilemedi. Bağlantını kontrol edip tekrar dene.");
    } finally {
      setBusy(false);
    }
  }

  const titles: Record<string, string> = {
    note: "Birkaç satır bırak",
    photo: "Bir fotoğraf ekle",
    audio: "Sesini kaydet",
    video: "Bir video ekle",
  };

  return (
    <div style={screenWrap}>
      <GhostButton theme={theme} onClick={onBack}>
        ← Geri
      </GhostButton>

      <h2
        style={{
          fontFamily: theme.fontDisplay,
          fontSize: 30,
          color: theme.ink,
          margin: "18px 0 22px",
        }}
      >
        {titles[type]}
      </h2>

      <div style={{ display: "flex", flexDirection: "column", gap: 16, flex: 1 }}>
        {/* Foto / Video */}
        {(type === "photo" || type === "video") &&
          (file && previewUrl ? (
            <div
              style={{
                border: `1px solid ${theme.line}`,
                borderRadius: 18,
                padding: 12,
                background: theme.card,
              }}
            >
              {type === "photo" ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={previewUrl}
                  alt=""
                  style={{ width: "100%", borderRadius: 12, maxHeight: 280, objectFit: "contain" }}
                />
              ) : (
                <video src={previewUrl} controls style={{ width: "100%", borderRadius: 12 }} />
              )}
              <GhostButton
                theme={theme}
                onClick={() => {
                  setFile(null);
                  setPreviewUrl(null);
                }}
              >
                Değiştir
              </GhostButton>
            </div>
          ) : (
            <label
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 8,
                padding: "40px 20px",
                border: `1.5px dashed ${theme.line}`,
                borderRadius: 18,
                background: theme.card,
                cursor: "pointer",
              }}
            >
              <span style={{ fontSize: 34 }}>{type === "photo" ? "📷" : "🎥"}</span>
              <span style={{ fontFamily: theme.fontSerif, fontSize: 17, color: theme.muted }}>
                {type === "photo" ? "Fotoğraf seç / çek" : "Video seç / çek"}
              </span>
              <input
                type="file"
                accept={type === "photo" ? "image/*" : "video/*"}
                capture="environment"
                style={{ display: "none" }}
                onChange={pickFile}
              />
            </label>
          ))}

        {/* Ses */}
        {type === "audio" && (
          <div
            style={{
              border: `1px solid ${theme.line}`,
              borderRadius: 18,
              padding: 24,
              background: theme.card,
              textAlign: "center",
            }}
          >
            {!file ? (
              <button
                onClick={recording ? stopRec : startRec}
                style={{
                  width: 90,
                  height: 90,
                  borderRadius: "50%",
                  border: "none",
                  cursor: "pointer",
                  fontSize: 34,
                  color: "#fff",
                  background: recording ? "#c0392b" : theme.accent,
                  animation: recording ? "mw-pulse 1.4s infinite" : "none",
                }}
              >
                {recording ? "⏹" : "🎙️"}
              </button>
            ) : (
              <>
                <audio src={previewUrl!} controls style={{ width: "100%" }} />
                <GhostButton
                  theme={theme}
                  onClick={() => {
                    setFile(null);
                    setPreviewUrl(null);
                  }}
                >
                  Yeniden kaydet
                </GhostButton>
              </>
            )}
            <p style={{ fontFamily: theme.fontSerif, fontSize: 15, color: theme.muted, marginTop: 12 }}>
              {recording ? "Kaydediliyor… bitince dokun" : file ? "" : "Kaydetmek için dokun"}
            </p>

            {/* Kayıt çalışmazsa: hazır ses dosyası yükle */}
            {!file && !recording && (
              <label
                style={{
                  display: "inline-block",
                  marginTop: 8,
                  fontFamily: theme.fontSerif,
                  fontSize: 15,
                  color: theme.accent,
                  textDecoration: "underline",
                  cursor: "pointer",
                }}
              >
                ya da ses dosyası yükle
                <input
                  type="file"
                  accept="audio/*"
                  style={{ display: "none" }}
                  onChange={pickFile}
                />
              </label>
            )}
          </div>
        )}

        {/* Mesaj / başlık */}
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={type === "note" ? 6 : 2}
          placeholder={type === "note" ? "Aklındakileri yaz…" : "Birkaç kelime (opsiyonel)"}
          style={{ ...inputStyle(theme), resize: "none" }}
        />

        {/* İsim */}
        <input
          value={guestName}
          onChange={(e) => setGuestName(e.target.value)}
          placeholder="Adın (opsiyonel)"
          style={inputStyle(theme)}
        />

        {error && (
          <p
            style={{
              fontFamily: theme.fontSerif,
              fontSize: 15,
              color: "#c0392b",
              background: "rgba(192,57,43,0.08)",
              padding: "10px 14px",
              borderRadius: 12,
            }}
          >
            {error}
          </p>
        )}
      </div>

      <div style={{ marginTop: 16 }}>
        <PrimaryButton theme={theme} onClick={save} disabled={busy || recording}>
          {busy ? "Gönderiliyor…" : "Anıyı Bırak ♥"}
        </PrimaryButton>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
//  TEŞEKKÜR
// ════════════════════════════════════════════════════════════════
export function Thanks({
  theme,
  names,
  onAgain,
  onHome,
}: {
  theme: Theme;
  names: string;
  onAgain: () => void;
  onHome: () => void;
}) {
  return (
    <div style={{ ...screenWrap, justifyContent: "center", textAlign: "center" }}>
      <Petals theme={theme} />
      <div style={{ position: "relative", zIndex: 1 }}>
        <div
          style={{
            width: 84,
            height: 84,
            borderRadius: "50%",
            background: theme.soft,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 38,
            margin: "0 auto 22px",
          }}
        >
          ♥
        </div>
        <h2 style={{ fontFamily: theme.fontDisplay, fontSize: 34, color: theme.ink }}>
          Teşekkür ederiz
        </h2>
        <p
          style={{
            fontFamily: theme.fontSerif,
            fontSize: 19,
            color: theme.muted,
            maxWidth: 300,
            margin: "14px auto 34px",
            lineHeight: 1.5,
          }}
        >
          Anın {names}&apos;e ulaştı. Bu güzel jestin için minnettarız.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <PrimaryButton theme={theme} onClick={onAgain}>
            Bir Anı Daha Bırak
          </PrimaryButton>
          <GhostButton theme={theme} onClick={onHome}>
            Başa dön
          </GhostButton>
        </div>
      </div>
    </div>
  );
}
