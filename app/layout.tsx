import type { Metadata } from "next";
import {
  Cormorant_Garamond,
  DM_Serif_Display,
  Allura,
} from "next/font/google";
import "./globals.css";
import { eventConfig } from "@/lib/config";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

const dmSerif = DM_Serif_Display({
  variable: "--font-dm-serif",
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
});

const allura = Allura({
  variable: "--font-allura",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  title: `${eventConfig.names} · Anı Duvarı`,
  description: eventConfig.headline,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="tr"
      className={`${cormorant.variable} ${dmSerif.variable} ${allura.variable} antialiased`}
    >
      <body>{children}</body>
    </html>
  );
}
