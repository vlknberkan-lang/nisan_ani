"use client";

import { useEffect, useRef, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { eventConfig } from "@/lib/config";
import { makeTheme } from "@/components/memory/theme";

export default function QRPage() {
  const theme = makeTheme(eventConfig.tone, eventConfig.accent);
  const [origin, setOrigin] = useState("");
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setOrigin(process.env.NEXT_PUBLIC_SITE_URL || window.location.origin);
  }, []);

  // QR doğrudan anı duvarı ana sayfasını gösterir
  const targetUrl = origin || "";

  function downloadQR() {
    const canvas = wrapRef.current?.querySelector("canvas");
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = "nisan-anı-qr.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  }

  return (
    <div
      style={{
        minHeight: "100dvh",
        background: theme.bg,
        color: theme.ink,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        fontFamily: theme.fontSerif,
      }}
    >
      <div style={{ width: "100%", maxWidth: 420, textAlign: "center" }}>
        <p
          style={{
            fontSize: 13,
            letterSpacing: "0.42em",
            textTransform: "uppercase",
            color: theme.accent,
            marginBottom: 14,
          }}
        >
          Anı Duvarı
        </p>
        <h1 style={{ fontFamily: theme.fontScript, fontSize: 56, lineHeight: 1.05 }}>
          {eventConfig.names}
        </h1>
        <p style={{ fontSize: 18, color: theme.muted, margin: "10px 0 24px" }}>
          Bu kodu okutarak bize bir anı bırak ♥
        </p>

        <div
          ref={wrapRef}
          style={{
            display: "inline-block",
            background: "#fff",
            padding: 22,
            borderRadius: 24,
            boxShadow: "0 16px 40px rgba(0,0,0,0.12)",
          }}
        >
          {targetUrl ? (
            <QRCodeCanvas
              value={targetUrl}
              size={260}
              level="H"
              fgColor={theme.accent}
              bgColor="#ffffff"
              marginSize={2}
            />
          ) : (
            <div style={{ width: 260, height: 260 }} />
          )}
        </div>

        <p style={{ fontSize: 12, color: theme.muted, marginTop: 12, wordBreak: "break-all" }}>
          {targetUrl}
        </p>

        <button
          onClick={downloadQR}
          style={{
            marginTop: 22,
            padding: "14px 30px",
            background: theme.accent,
            color: "#fff",
            border: "none",
            borderRadius: 999,
            fontFamily: theme.fontSerif,
            fontSize: 17,
            fontWeight: 600,
            letterSpacing: "0.04em",
            cursor: "pointer",
            boxShadow: `0 12px 28px ${theme.accent}44`,
          }}
        >
          QR Kodunu İndir
        </button>

        <p style={{ fontSize: 13, color: theme.muted, marginTop: 16 }}>
          Masalara koyabilir ya da davetiyeye ekleyebilirsiniz.
        </p>
      </div>
    </div>
  );
}
