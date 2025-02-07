//rewrites allows you to redefine how a path should be handled behind the scenes

/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        return [
          // Main site (localhost)
          {
            source: '/',
            destination: '/store',
            has: [{ type: 'host', value: 'localhost' }]
          },
          {
            source: '/:path*',
            destination: '/store/:path*',
            has: [{ type: 'host', value: 'localhost' }]
          },
          // Admin site (admin.localhost)
          {
            source: '/',
            destination: '/signin',
            has: [{ type: 'host', value: 'admin.localhost' }]
          },
          {
            source: '/signin',
            destination: '/signin',
            has: [{ type: 'host', value: 'admin.localhost' }]
          },
          {
            source: '/',
            destination: '/orders',
            has: [{ type: 'host', value: 'admin.localhost' }]
          },
          {
            source: '/:path*',
            destination: '/admin/:path*',
            has: [{ type: 'host', value: 'admin.localhost' }]
          }
        ];
    },
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
};

export default nextConfig;
