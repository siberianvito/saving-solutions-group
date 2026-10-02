import type { NextConfig } from "next";

// Set by the GitHub Pages workflow (e.g. "/quantum-impact-marketing").
// Unset locally and on root-domain hosts like Vercel or a custom domain.
const basePath = process.env.PAGES_BASE_PATH || undefined;

const nextConfig: NextConfig = {
  // This app is its own workspace (the parent folder holds sibling client sites)
  turbopack: { root: __dirname },
  // Fully static site — exportable to any static host
  output: "export",
  basePath,
  images: { unoptimized: true },
  devIndicators: false,
  env: { NEXT_PUBLIC_BASE_PATH: basePath ?? "" },
};

export default nextConfig;
