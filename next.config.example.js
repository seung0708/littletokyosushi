/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '<your-supabase-project>.supabase.co',
        port: '',
        pathname: '/**',
      },
    ]
  },
}

module.exports = nextConfig
