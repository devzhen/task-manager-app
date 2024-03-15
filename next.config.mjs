/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '5ryohuhemoegbt23.public.blob.vercel-storage.com',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: `/boards`,
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
