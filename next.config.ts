import type { NextConfig } from "next";
import path from "path";

// GitHub Pages'e yayınlarken (workflow GITHUB_PAGES=true ayarlar) statik export modu.
// Yerel geliştirme ve Vercel'de normal mod çalışır.
const isGhPages = process.env.GITHUB_PAGES === "true";
const repo = "nisan_ani";

const nextConfig: NextConfig = {
  reactCompiler: true,
  turbopack: {
    root: path.join(__dirname),
  },
  ...(isGhPages
    ? {
        output: "export" as const,
        basePath: `/${repo}`,
        assetPrefix: `/${repo}/`,
        images: { unoptimized: true },
        trailingSlash: true,
      }
    : {}),
};

export default nextConfig;
