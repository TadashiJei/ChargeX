/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'dafi.hacktivators.com',
        port: '',
        pathname: '/team/**',
      },
    ],
  },
}

module.exports = nextConfig
