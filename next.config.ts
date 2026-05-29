import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  webpack: (config) => {
    // Fix for mammoth and pdfjs-dist in Next.js
    config.resolve.alias = {
      ...config.resolve.alias,
      canvas: false,
    };
    return config;
  },
};

export default nextConfig;