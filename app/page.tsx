import Link from "next/link";
import { eventConfig } from "@/lib/config";

export default function Home() {
  return (
    <main className="flex flex-1 items-center justify-center px-6 py-16">
      <div className="animate-fade-up w-full max-w-xl text-center">
        {/* Üst süs */}
        <p className="font-sans text-sm uppercase tracking-[0.35em] text-accent">
          {eventConfig.tagline}
        </p>

        <div className="my-6 flex items-center justify-center gap-4 text-accent/60">
          <span className="h-px w-16 bg-accent/40" />
          <span className="text-2xl">♥</span>
          <span className="h-px w-16 bg-accent/40" />
        </div>

        {/* İsimler */}
        <h1 className="font-serif text-5xl leading-tight text-foreground sm:text-6xl">
          {eventConfig.person1}
          <span className="mx-3 text-accent">&amp;</span>
          {eventConfig.person2}
        </h1>

        {/* Tarih / yer */}
        <div className="mt-8 space-y-1 font-sans text-foreground/80">
          <p className="text-lg font-medium">{eventConfig.dateLabel}</p>
          <p>{eventConfig.timeLabel}</p>
          <p className="text-accent">{eventConfig.venue}</p>
          <p className="text-sm text-foreground/60">{eventConfig.venueAddress}</p>
        </div>

        {/* Açıklama */}
        <p className="mx-auto mt-10 max-w-md font-sans text-foreground/70">
          {eventConfig.memoryIntro}
        </p>

        {/* Butonlar */}
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/birak"
            className="w-full rounded-full bg-accent px-8 py-3.5 font-sans font-semibold text-white shadow-lg shadow-accent/30 transition hover:scale-[1.03] hover:bg-accent/90 sm:w-auto"
          >
            Anı Bırak ♥
          </Link>
          <Link
            href="/anilar"
            className="w-full rounded-full border border-accent/40 px-8 py-3.5 font-sans font-semibold text-accent transition hover:bg-accent/10 sm:w-auto"
          >
            Anıları Gör
          </Link>
        </div>

        <p className="mt-12 font-sans text-xs text-foreground/40">
          Bıraktığınız her anı bizim için çok değerli — teşekkür ederiz. ♥
        </p>
      </div>
    </main>
  );
}
