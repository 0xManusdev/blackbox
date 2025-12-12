/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://blackbox-backend-2z8a.onrender.com/api/:path*',
      },
    ];
  },
};

export default nextConfig;
