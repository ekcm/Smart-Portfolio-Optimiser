/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  // Disable server-side features since we're deploying statically
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
