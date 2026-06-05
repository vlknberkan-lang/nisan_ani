import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { eventConfig } from "@/lib/config";

export const dynamic = "force-dynamic";

type Memory = {
  id: string;
  created_at: string;
  guest_name: string | null;
  message: string | null;
  media_url: string | null;
  media_type: "photo" | "audio" | "video" | "none";
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("tr-TR", {
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function AnilarPage() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("memories")
    .select("*")
    .order("created_at", { ascending: false });

  const memories = (data as Memory[] | null) ?? [];

  return (
    <main className="flex flex-1 flex-col px-6 py-12">
      <div className="mx-auto w-full max-w-5xl">
        <div className="mb-10 text-center">
          <Link href="/" className="font-sans text-sm text-accent hover:underline">
            ← Ana sayfa
          </Link>
          <h1 className="mt-3 font-serif text-4xl text-foreground">Anı Defteri</h1>
          <p className="mt-2 font-sans text-foreground/60">
            {eventConfig.person1} &amp; {eventConfig.person2} için bırakılan anılar
          </p>
        </div>

        {error && (
          <p className="rounded-xl bg-red-50 px-4 py-3 text-center font-sans text-sm text-red-600">
            Anılar yüklenemedi. Supabase ayarlarını kontrol edin.
          </p>
        )}

        {!error && memories.length === 0 && (
          <div className="rounded-3xl border border-accent/20 bg-white/50 py-20 text-center">
            <p className="text-4xl">🤍</p>
            <p className="mt-4 font-sans text-foreground/60">
              Henüz anı bırakılmamış. İlk anıyı sen bırak!
            </p>
            <Link
              href="/birak"
              className="mt-6 inline-block rounded-full bg-accent px-6 py-3 font-sans font-semibold text-white transition hover:bg-accent/90"
            >
              Anı Bırak ♥
            </Link>
          </div>
        )}

        <div className="columns-1 gap-5 sm:columns-2 lg:columns-3">
          {memories.map((m) => (
            <div
              key={m.id}
              className="mb-5 break-inside-avoid rounded-3xl border border-accent/15 bg-white/70 p-5 shadow-sm"
            >
              {m.media_type === "photo" && m.media_url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={m.media_url}
                  alt="Anı"
                  className="mb-3 w-full rounded-2xl object-cover"
                />
              )}
              {m.media_type === "video" && m.media_url && (
                <video
                  src={m.media_url}
                  controls
                  className="mb-3 w-full rounded-2xl"
                />
              )}
              {m.media_type === "audio" && m.media_url && (
                <audio src={m.media_url} controls className="mb-3 w-full" />
              )}

              {m.message && (
                <p className="font-sans text-foreground/90">{m.message}</p>
              )}

              <div className="mt-3 flex items-center justify-between font-sans text-xs">
                <span className="font-semibold text-accent">
                  {m.guest_name || "Bir misafir"}
                </span>
                <span className="text-foreground/40">
                  {formatDate(m.created_at)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
