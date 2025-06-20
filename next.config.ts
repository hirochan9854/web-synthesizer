import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  // Enable static export for GitHub Pages or other static hosting
  basePath: process.env.NODE_ENV === 'production' ? '/web-synthesizer' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/web-synthesizer/' : '',
};

export default nextConfig;
