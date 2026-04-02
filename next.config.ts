import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  // serverExternalPackages sekarang diletakkan di sini, bukan di dalam experimental
  serverExternalPackages: ["@node-rs/argon2"], 
};

export default nextConfig;