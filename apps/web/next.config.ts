import type { NextConfig } from "next";

const transpilePackages = [
  process.env.NEXT_PUBLIC_HELLO_WORLD_BINDING || "",
  process.env.NEXT_PUBLIC_INCREMENT_BINDING || "",
  process.env.NEXT_PUBLIC_POD_POAP_BINDING || "",
  // Explicitly include pod_poap package to ensure it's bundled in production
  "pod_poap",
  "donation",
].filter(Boolean) as string[];

type WebpackConfig = Parameters<NonNullable<NextConfig["webpack"]>>[0];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  typedRoutes: true,
  transpilePackages,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
      {
        protocol: "https",
        hostname: "design-system.stellar.org",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  webpack: (config: WebpackConfig, { isServer }) => {
    // Suppress warnings from Stellar SDK's native dependencies
    // These are expected: sodium-native and require-addon are Node.js native modules
    // that the SDK uses server-side but falls back to browser-compatible code client-side
    config.ignoreWarnings = [
      ...(config.ignoreWarnings || []),
      {
        module: /node_modules\/require-addon/,
        message: /Critical dependency/,
      },
      {
        module: /node_modules\/sodium-native/,
        message: /Critical dependency/,
      },
      {
        module: /node_modules\/@stellar\/stellar-base/,
        message: /Critical dependency/,
      },
      // Suppress warning for dynamic imports in contract modules
      // This is expected: podPoap.ts uses dynamic imports with variable module IDs
      {
        module: /lib\/contracts\/podPoap\.ts/,
        message: /Critical dependency: the request of a dependency is an expression/,
      },
    ];

    // Exclude native modules from client-side bundle
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
