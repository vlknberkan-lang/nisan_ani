// ─────────────────────────────────────────────────────────────
//  NİŞAN ANI DUVARI — Etkinlik Bilgileri
//  Aşağıdaki bilgileri kendi nişanınıza göre düzenleyin.
// ─────────────────────────────────────────────────────────────

export const eventConfig = {
  // Çiftin isimleri
  names: "Yelda & Berkan",

  // Karşılama metni
  headline:
    "Bugünü bizimle yaşadın. Aklında kalan bir kare, bir ses ya da birkaç satır — burada bırak, biz ömür boyu saklayalım.",

  // Tema: 'warm' (sıcak) | 'playful' (eğlenceli)
  tone: "playful" as Tone,

  // Vurgu rengi
  accent: "#c95b7a",

  // Çift paneli (sadece size özel "kim ne paylaşmış" sayfası) giriş kodu
  // /panel adresinde sorulur. İstediğiniz gibi değiştirin.
  panelPin: "2026",
} as const;

export type Tone = "warm" | "playful";
export type MediaType = "photo" | "audio" | "video" | "none";
