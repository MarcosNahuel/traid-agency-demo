/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['http2.mlstatic.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.mlstatic.com',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/conversations',
        destination: '/conversaciones',
      },
      {
        source: '/support',
        destination: '/soporte',
      },
    ]
  },
}


module.exports = nextConfig
