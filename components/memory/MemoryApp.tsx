"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { eventConfig, type MediaType } from "@/lib/config";
import { makeTheme } from "./theme";
import { PaperGrain } from "./Decor";
import { Welcome, PickType, Capture, Thanks } from "./screens";
import { Wall } from "./Wall";

type Screen = "welcome" | "pick" | "capture" | "thanks" | "wall";

export default function MemoryApp() {
  const theme = makeTheme(eventConfig.tone, eventConfig.accent);

  const [screen, setScreen] = useState<Screen>("welcome");
  const [type, setType] = useState<MediaType | "note">("note");
  const [count, setCount] = useState(0);
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("memories")
      .select("*", { count: "exact", head: true })
      .then(({ count }) => setCount(count ?? 0));
  }, [refresh, screen]);

  const go = (s: Screen) => setScreen(s);
  const bump = () => setRefresh((r) => r + 1);

  let view: React.ReactNode = null;
  if (screen === "welcome") {
    view = (
      <Welcome
        theme={theme}
        names={eventConfig.names}
        headline={eventConfig.headline}
        count={count}
        onStart={() => go("pick")}
        onSecret={() => go("wall")}
      />
    );
  } else if (screen === "pick") {
    view = (
      <PickType
        theme={theme}
        onBack={() => go("welcome")}
        onPick={(t) => {
          setType(t);
          go("capture");
        }}
      />
    );
  } else if (screen === "capture") {
    view = (
      <Capture
        theme={theme}
        type={type}
        onBack={() => go("pick")}
        onSaved={() => {
          bump();
          go("thanks");
        }}
      />
    );
  } else if (screen === "thanks") {
    view = (
      <Thanks
        theme={theme}
        names={eventConfig.names}
        onAgain={() => go("pick")}
        onHome={() => go("welcome")}
      />
    );
  } else if (screen === "wall") {
    view = <Wall theme={theme} refreshKey={refresh} onBack={() => go("welcome")} />;
  }

  return (
    <div
      style={{
        minHeight: "100dvh",
        background: "#1a1611",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 420,
          aspectRatio: "9 / 18.5",
          minHeight: "100dvh",
          position: "relative",
          overflow: "hidden",
          background: theme.bg,
          color: theme.ink,
          boxShadow: "0 0 60px rgba(0,0,0,0.4)",
        }}
        className="mw-frame"
      >
        <PaperGrain opacity={eventConfig.tone === "playful" ? 0.05 : 0.08} />
        <div className="mw-screen" key={screen} style={{ height: "100%", position: "relative", zIndex: 1 }}>
          {view}
        </div>
      </div>
    </div>
  );
}
