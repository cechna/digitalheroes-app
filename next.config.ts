import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Modalità standalone per il deployment su Hostinger, VPS, Docker o server Node.js personalizzati
  output: "standalone",
};

export default nextConfig;
