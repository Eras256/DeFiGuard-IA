/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['nullshot.ai'],
  },
  env: {
    NEXT_PUBLIC_APP_NAME: 'DeFiGuard AI',
  },
  webpack: (config) => {
    config.resolve.fallback = { fs: false, net: false, tls: false };
    return config;
  },
}

module.exports = nextConfig

