import path from "path";
import { loadEnvConfig } from "@next/env";
import type { NextConfig } from "next";

// Load shared env from the monorepo root (.env lives outside apps/web)
loadEnvConfig(path.resolve(__dirname, "../.."));

type WebpackConfig = Parameters<NonNullable<NextConfig["webpack"]>>[0];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  typedRoutes: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "gateway.pinata.cloud",
      },
    ],
  },
  webpack: (config: WebpackConfig, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        crypto: false,
      };
    }

    return config;
  },
};

export default nextConfig;
