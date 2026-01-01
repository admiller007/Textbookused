import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  serverExternalPackages: ['jsdom', '@mozilla/readability'],
};

export default nextConfig;
