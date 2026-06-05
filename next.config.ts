import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  reactCompiler: true,
  // Üst klasördeki lockfile uyarısını önlemek için kök dizini sabitle
  turbopack: {
    root: path.join(__dirname),
  },
};

export default nextConfig;
