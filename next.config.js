/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.fallback = { fs: false, "react-native": false }

    return config
  }
}

module.exports = nextConfig
