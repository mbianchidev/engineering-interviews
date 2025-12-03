import type { NextConfig } from "next";

// Use DEPLOY_ENV to explicitly control static export mode
// Set DEPLOY_ENV=github-pages when deploying to GitHub Pages
const isStaticExport = process.env.DEPLOY_ENV === 'github-pages';

// Note: Static export mode disables API routes, which means authentication 
// (NextAuth.js) and payment processing (Stripe) will NOT work.
// For full functionality with auth and payments, deploy to a platform that 
// supports Next.js API routes (Vercel, Netlify, Railway, etc.)
const nextConfig: NextConfig = {
  // Only use static export when explicitly enabled (disables auth & payments)
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
