/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        return [
          // Main site (localhost)
          {
            source: '/',
            destination: '/main',
            has: [{ type: 'host', value: 'localhost' }]
          },
          {
            source: '/:path*',
            destination: '/main/:path*',
            has: [{ type: 'host', value: 'localhost' }]
          },
          // Admin site (admin.localhost)
          {
            source: '/',
            destination: '/login',
            has: [{ type: 'host', value: 'admin.localhost' }]
          },
          {
            source: '/login',
            destination: '/login',
            has: [{ type: 'host', value: 'admin.localhost' }]
          },
          {
            source: '/dashboard',
            destination: '/admin/dashboard',
            has: [{ type: 'host', value: 'admin.localhost' }]
          },
          {
            source: '/:path*',
            destination: '/admin/:path*',
            has: [{ type: 'host', value: 'admin.localhost' }]
          }
        ];
    }
};

export default nextConfig;
