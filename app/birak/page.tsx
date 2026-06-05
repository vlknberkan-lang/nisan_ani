"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { eventConfig, type MediaType } from "@/lib/config";

type Status = "idle" | "uploading" | "success" | "error";

export default function BirakPage() {
  const [guestName, setGuestName] = useState("");
  const [message, setMessage] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [mediaType, setMediaType] = useState<MediaType>("none");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [recording, setRecording] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  // ── Dosya seçimi (foto / video) ─────────────────────────────
  function handleFile(e: React.ChangeEvent<HTMLInputElement>, type: MediaType) {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setMediaType(type);
    setPreviewUrl(URL.createObjectURL(f));
  }

  function clearMedia() {
    setFile(null);
    setMediaType("none");
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
  }

  // ── Ses kaydı ───────────────────────────────────────────────
  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];
      recorder.ondataavailable = (ev) => {
        if (ev.data.size > 0) chunksRef.current.push(ev.data);
      };
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        const audioFile = new File([blob], `ses-${Date.now()}.webm`, {
          type: "audio/webm",
        });
        setFile(audioFile);
        setMediaType("audio");
        setPreviewUrl(URL.createObjectURL(blob));
        stream.getTracks().forEach((t) => t.stop());
      };
      recorder.start();
      mediaRecorderRef.current = recorder;
      setRecording(true);
    } catch {
      setErrorMsg("Mikrofona erişilemedi. Lütfen izin verin.");
      setStatus("error");
    }
  }

  function stopRecording() {
    mediaRecorderRef.current?.stop();
    setRecording(false);
  }

  // ── Gönder ──────────────────────────────────────────────────
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg("");

    if (!file && !message.trim()) {
      setErrorMsg("Lütfen bir not yazın ya da bir medya ekleyin.");
      setStatus("error");
      return;
    }

    setStatus("uploading");

    try {
      const supabase = createClient();
      let mediaUrl: string | null = null;

      if (file) {
        const ext = file.name.split(".").pop() || "dat";
        const path = `${mediaType}/${crypto.randomUUID()}.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from("anilar")
          .upload(path, file, { cacheControl: "3600", upsert: false });
        if (uploadError) throw uploadError;

        const { data } = supabase.storage.from("anilar").getPublicUrl(path);
        mediaUrl = data.publicUrl;
      }

      const { error: insertError } = await supabase.from("memories").insert({
        guest_name: guestName.trim() || null,
        message: message.trim() || null,
        media_url: mediaUrl,
        media_type: mediaType,
      });
      if (insertError) throw insertError;

      setStatus("success");
    } catch (err) {
      console.error(err);
      setErrorMsg(
        "Bir hata oluştu. Lütfen tekrar deneyin. (Supabase ayarlarını kontrol edin.)"
      );
      setStatus("error");
    }
  }

  // ── Başarılı ekran ─────────────────────────────────────────
  if (status === "success") {
    return (
      <main className="flex flex-1 items-center justify-center px-6 py-16">
        <div className="animate-fade-up max-w-md text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-accent/15 text-4xl">
            ♥
          </div>
          <h1 className="font-serif text-3xl text-foreground">Teşekkür ederiz!</h1>
          <p className="mt-4 font-sans text-foreground/70">
            Anınız {eventConfig.person1} &amp; {eventConfig.person2}&apos;ye
            ulaştı. Bu güzel jestin için minnettarız. ♥
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <button
              onClick={() => {
                clearMedia();
                setGuestName("");
                setMessage("");
                setStatus("idle");
              }}
              className="rounded-full bg-accent px-6 py-3 font-sans font-semibold text-white transition hover:bg-accent/90"
            >
              Bir Anı Daha Bırak
            </button>
            <Link
              href="/anilar"
              className="rounded-full border border-accent/40 px-6 py-3 font-sans font-semibold text-accent transition hover:bg-accent/10"
            >
              Anıları Gör
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex flex-1 justify-center px-6 py-12">
      <form
        onSubmit={handleSubmit}
        className="animate-fade-up w-full max-w-lg space-y-6"
      >
        <div className="text-center">
          <Link
            href="/"
            className="font-sans text-sm text-accent hover:underline"
          >
            ← Ana sayfa
          </Link>
          <h1 className="mt-3 font-serif text-4xl text-foreground">Anı Bırak</h1>
          <p className="mt-2 font-sans text-sm text-foreground/60">
            {eventConfig.memoryIntro}
          </p>
        </div>

        {/* İsim */}
        <div>
          <label className="mb-1.5 block font-sans text-sm font-medium text-foreground/80">
            Adın (opsiyonel)
          </label>
          <input
            type="text"
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
            placeholder="Adın..."
            className="w-full rounded-2xl border border-accent/20 bg-white/70 px-4 py-3 font-sans text-foreground outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
          />
        </div>

        {/* Mesaj */}
        <div>
          <label className="mb-1.5 block font-sans text-sm font-medium text-foreground/80">
            Mesajın / Dileğin
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            placeholder="Birkaç güzel söz bırak..."
            className="w-full resize-none rounded-2xl border border-accent/20 bg-white/70 px-4 py-3 font-sans text-foreground outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
          />
        </div>

        {/* Medya ekleme */}
        <div>
          <p className="mb-2 font-sans text-sm font-medium text-foreground/80">
            Medya ekle (opsiyonel)
          </p>

          {!file ? (
            <div className="grid grid-cols-3 gap-3">
              {/* Fotoğraf */}
              <label className="flex cursor-pointer flex-col items-center gap-1.5 rounded-2xl border border-accent/20 bg-white/60 py-4 text-center transition hover:border-accent hover:bg-accent/5">
                <span className="text-2xl">📷</span>
                <span className="font-sans text-xs text-foreground/70">
                  Fotoğraf
                </span>
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={(e) => handleFile(e, "photo")}
                />
              </label>

              {/* Video */}
              <label className="flex cursor-pointer flex-col items-center gap-1.5 rounded-2xl border border-accent/20 bg-white/60 py-4 text-center transition hover:border-accent hover:bg-accent/5">
                <span className="text-2xl">🎥</span>
                <span className="font-sans text-xs text-foreground/70">Video</span>
                <input
                  type="file"
                  accept="video/*"
                  capture="environment"
                  className="hidden"
                  onChange={(e) => handleFile(e, "video")}
                />
              </label>

              {/* Ses kaydı */}
              <button
                type="button"
                onClick={recording ? stopRecording : startRecording}
                className={`flex flex-col items-center gap-1.5 rounded-2xl border py-4 text-center transition ${
                  recording
                    ? "animate-pulse border-red-400 bg-red-50"
                    : "border-accent/20 bg-white/60 hover:border-accent hover:bg-accent/5"
                }`}
              >
                <span className="text-2xl">{recording ? "⏺️" : "🎙️"}</span>
                <span className="font-sans text-xs text-foreground/70">
                  {recording ? "Durdur" : "Ses Kaydı"}
                </span>
              </button>
            </div>
          ) : (
            /* Önizleme */
            <div className="rounded-2xl border border-accent/20 bg-white/60 p-4">
              {mediaType === "photo" && previewUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={previewUrl}
                  alt="Önizleme"
                  className="mx-auto max-h-64 rounded-xl object-contain"
                />
              )}
              {mediaType === "video" && previewUrl && (
                <video
                  src={previewUrl}
                  controls
                  className="mx-auto max-h-64 rounded-xl"
                />
              )}
              {mediaType === "audio" && previewUrl && (
                <audio src={previewUrl} controls className="w-full" />
              )}
              <button
                type="button"
                onClick={clearMedia}
                className="mt-3 w-full rounded-full border border-accent/30 py-2 font-sans text-sm text-accent transition hover:bg-accent/10"
              >
                Kaldır / Değiştir
              </button>
            </div>
          )}
        </div>

        {/* Hata */}
        {status === "error" && errorMsg && (
          <p className="rounded-xl bg-red-50 px-4 py-3 font-sans text-sm text-red-600">
            {errorMsg}
          </p>
        )}

        {/* Gönder */}
        <button
          type="submit"
          disabled={status === "uploading" || recording}
          className="w-full rounded-full bg-accent px-8 py-4 font-sans text-lg font-semibold text-white shadow-lg shadow-accent/30 transition hover:bg-accent/90 disabled:opacity-60"
        >
          {status === "uploading" ? "Gönderiliyor..." : "Anıyı Gönder ♥"}
        </button>
      </form>
    </main>
  );
}
