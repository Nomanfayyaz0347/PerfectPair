import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: false,
  },
  experimental: {
    optimizePackageImports: ['@headlessui/react', '@heroicons/react'],
  },
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
