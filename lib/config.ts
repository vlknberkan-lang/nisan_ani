// ─────────────────────────────────────────────────────────────
//  NİŞAN ANI DEFTERİ — Etkinlik Bilgileri
//  Aşağıdaki bilgileri kendi nişanınıza göre düzenleyin.
// ─────────────────────────────────────────────────────────────

export const eventConfig = {
  // Çiftin isimleri (davetiyede ve başlıkta görünür)
  person1: "Berkan",
  person2: "İsim",

  // Etkinlik tarihi ve yeri
  dateLabel: "5 Haziran 2026",
  timeLabel: "19:00",
  venue: "Mekan Adı",
  venueAddress: "Şehir / Adres",

  // Davetiye üst yazısı
  tagline: "Nişanımıza hoş geldiniz",

  // Anı bırakma sayfası karşılama yazısı
  memoryIntro:
    "Bu özel günümüzde bize bir anı bırakır mısın? Bir fotoğraf, sesli mesaj, kısa video ya da birkaç güzel söz... Hepsi bizim için çok kıymetli.",

  // Tema rengi (Tailwind ile uyumlu hex)
  accentColor: "#b76e79", // gül kurusu
} as const;

export type MediaType = "photo" | "audio" | "video" | "none";
