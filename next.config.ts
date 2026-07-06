import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // three.js ships untranspiled ESM; keep it server-external-safe and tree-shaken.
  transpilePackages: ["three"],
};

export default nextConfig;
