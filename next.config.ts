import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Optimize production headers and strict mode
  poweredByHeader: false,
  reactStrictMode: true,
  // Ensure Lucide and external images if needed
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
