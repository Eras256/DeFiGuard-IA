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
  webpack: (config, { isServer }) => {
    config.resolve.fallback = { fs: false, net: false, tls: false };
    
    // Exclude typechain-types from client-side build
    if (!isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        'typechain-types': false,
      };
    }
    
    // Ignore typechain-types in webpack
    config.module.rules.push({
      test: /typechain-types/,
      use: 'null-loader',
    });
    
    // Ignore typechain-types during TypeScript compilation
    config.externals = config.externals || [];
    if (Array.isArray(config.externals)) {
      config.externals.push(/^typechain-types/);
    }
    
    return config;
  },
  typescript: {
    // Ignore typechain-types during build
    ignoreBuildErrors: false,
  },
}

module.exports = nextConfig

