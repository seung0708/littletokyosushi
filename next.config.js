/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'bgicdxzqgxuqjvdxkfqh.supabase.co',
        port: '',
        pathname: '/**',
      },
    ]
  },
}

module.exports = nextConfig
