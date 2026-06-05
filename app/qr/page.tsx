"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { QRCodeCanvas } from "qrcode.react";
import { eventConfig } from "@/lib/config";

export default function QRPage() {
  const [origin, setOrigin] = useState("");
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Yayınlandığında NEXT_PUBLIC_SITE_URL, yoksa tarayıcının adresi kullanılır.
    setOrigin(process.env.NEXT_PUBLIC_SITE_URL || window.location.origin);
  }, []);

  const targetUrl = origin ? `${origin}/birak` : "";

  function downloadQR() {
    const canvas = wrapRef.current?.querySelector("canvas");
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = "nisan-qr.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  }

  return (
    <main className="flex flex-1 items-center justify-center px-6 py-12">
      <div className="animate-fade-up w-full max-w-md text-center">
        <Link href="/" className="font-sans text-sm text-accent hover:underline">
          ← Ana sayfa
        </Link>

        <h1 className="mt-3 font-serif text-4xl text-foreground">
          {eventConfig.person1} &amp; {eventConfig.person2}
        </h1>
        <p className="mt-2 font-sans text-foreground/60">
          Bu kodu okutarak bize bir anı bırakabilirsin ♥
        </p>

        <div
          ref={wrapRef}
          className="mx-auto mt-8 inline-block rounded-3xl border border-accent/20 bg-white p-6 shadow-lg"
        >
          {targetUrl ? (
            <QRCodeCanvas
              value={targetUrl}
              size={256}
              level="H"
              fgColor="#b76e79"
              bgColor="#ffffff"
              marginSize={2}
            />
          ) : (
            <div className="h-64 w-64 animate-pulse rounded-xl bg-accent/10" />
          )}
        </div>

        <p className="mt-4 break-all font-sans text-xs text-foreground/40">
          {targetUrl}
        </p>

        <button
          onClick={downloadQR}
          className="mt-6 rounded-full bg-accent px-8 py-3 font-sans font-semibold text-white shadow-lg shadow-accent/30 transition hover:bg-accent/90"
        >
          QR Kodunu İndir
        </button>

        <p className="mt-4 font-sans text-xs text-foreground/40">
          İpucu: Bu kodu masalara koyabilir ya da davetiyeye ekleyebilirsiniz.
        </p>
      </div>
    </main>
  );
}
