/** @type {import('next').NextConfig} */
const nextConfig = {
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
