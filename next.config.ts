import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: false,
  },
  experimental: {
    optimizePackageImports: ['@headlessui/react', '@heroicons/react'],
  },
};

export default nextConfig;
