import type { NextConfig } from "next";

const isProduction = process.env.NODE_ENV === 'production';
const isGitHubPages = process.env.GITHUB_ACTIONS === 'true' || process.env.DEPLOY_ENV === 'github-pages';

const nextConfig: NextConfig = {
  ...(isProduction && { output: 'export' }),
  images: {
    unoptimized: true,
  },
  basePath: isGitHubPages ? '/engineering-interviews' : '',
};

export default nextConfig;
