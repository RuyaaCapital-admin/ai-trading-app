/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['@modelcontextprotocol/sdk'],
  },
  env: {
    EODHD_API_KEY: process.env.EODHD_API_KEY,
  }
};

export default nextConfig;
