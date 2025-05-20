import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // export in /output/ directory
  output: "export",
  images: { unoptimized: true },
};

export default nextConfig;
