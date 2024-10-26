/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        return [
          {
            source: '/',
            destination: '/main/home',
            has: [{ type: 'host', value: 'localhost' }]
          },
          {
            source: '/:path*',
            destination: '/main/:path*',
            has: [{ type: 'host', value: 'localhost' }]
          },
          {
            source: '/',
            destination: '/admin/dashboard',
            has: [{ type: 'host', value: 'admin.localhost' }]
          },
          {
            source: '/:path*',
            destination: '/admin/:path*',
            has: [{ type: 'host', value: 'admin.localhost' }]
          }
        ]
      }
};

export default nextConfig;

