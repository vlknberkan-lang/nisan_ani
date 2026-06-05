# 💍 Nişan Anı Defteri

Misafirlerin QR kod okutarak **fotoğraf, ses kaydı, video veya yazılı not**
bırakabildiği dijital anı defteri. Next.js + Tailwind + Supabase ile yapıldı.

## Sayfalar

| Adres      | Açıklama                                          |
| ---------- | ------------------------------------------------- |
| `/`        | Davetiye / ana sayfa                              |
| `/birak`   | Misafirin anı bıraktığı sayfa (foto/ses/video/not)|
| `/anilar`  | Bırakılan tüm anıların galerisi                   |
| `/qr`      | Masalara/davetiyeye koyabileceğin QR kodu         |

---

## Kurulum (3 adım)

### 1) Supabase veritabanını hazırla

1. [supabase.com](https://supabase.com) → projeni aç.
2. Sol menü → **SQL Editor** → **New query**.
3. `supabase/schema.sql` dosyasının içeriğini yapıştır → **RUN**.
   (Bu; `memories` tablosunu, `anilar` storage bucket'ını ve izinleri oluşturur.)

### 2) Ortam değişkenlerini gir

`.env.local` dosyasını aç ve Supabase bilgilerini doldur
(**Project Settings → API**):

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 3) Çalıştır

```bash
npm run dev
```

[http://localhost:3000](http://localhost:3000) adresini aç.

---

## Kişiselleştirme

İsimler, tarih, mekan ve metinler tek dosyada:
**`lib/config.ts`** — buradan düzenle.

## Yayınlama (Vercel)

1. Projeyi GitHub'a yükle.
2. [vercel.com](https://vercel.com) → **Import Project** → repo'yu seç.
3. **Environment Variables** kısmına `.env.local`'daki 3 değişkeni ekle.
   - `NEXT_PUBLIC_SITE_URL`'i canlı adresinle güncelle (örn: `https://nisanimiz.vercel.app`).
4. Deploy → bitince `/qr` sayfasından QR kodunu indir ve paylaş. ♥

## Moderasyon

İstenmeyen bir anıyı gizlemek için Supabase → Table Editor → `memories`
tablosunda ilgili satırın `approved` değerini `false` yap.
