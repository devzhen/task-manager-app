/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '5ryohuhemoegbt23.public.blob.vercel-storage.com',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: `/boards/home-board`,
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
