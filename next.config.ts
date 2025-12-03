import type { NextConfig } from "next";

// Use DEPLOY_ENV to explicitly control static export mode
// Set DEPLOY_ENV=github-pages when deploying to GitHub Pages
const isStaticExport = process.env.DEPLOY_ENV === 'github-pages';

// Note: Static export is only enabled for GitHub Pages deployments.
// For production deployments with auth and Stripe, use a hosting service 
// that supports Next.js API routes (Vercel, Netlify, etc.)
const nextConfig: NextConfig = {
  // Only use static export when explicitly enabled
  ...(isStaticExport && { output: 'export' }),
  images: {
    unoptimized: true,
    // Allow images from OAuth providers
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
    ],
  },
  basePath: isStaticExport ? '/engineering-interviews' : '',
};

export default nextConfig;
