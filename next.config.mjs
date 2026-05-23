/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer, webpack }) => {
    if (!isServer) {
      // Browser polyfills required by @solana/web3.js + @coral-xyz/anchor
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        os: false,
        path: false,
        crypto: false,
        stream: false,
        'pino-pretty': false,
        buffer: 'buffer',
      }

      config.plugins.push(
        new webpack.ProvidePlugin({
          Buffer: ['buffer', 'Buffer'],
          process: 'process/browser',
        })
      )
    } else {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        os: false,
        path: false,
        crypto: false,
        'pino-pretty': false,
      }
    }

    // Suppress walletconnect dynamic expression warnings
    config.module = config.module || {}
    config.module.exprContextCritical = false

    return config
  },
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
}

export default nextConfig
