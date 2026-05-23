/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      os: false,
      path: false,
      crypto: false,
      'pino-pretty': false,
    }

    // Suppress walletconnect expression warnings
    config.module = config.module || {}
    config.module.exprContextCritical = false

    return config
  },
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
}

export default nextConfig
