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
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "connect-src 'self' https://*.stripe.com https://r.stripe.com;",
          },
        ],
      },
    ];
  },
}

module.exports = nextConfig
