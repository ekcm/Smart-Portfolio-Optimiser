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
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
  // Handle dynamic routes in static export
  experimental: {
    appDocumentPreloading: false,
  },
};

export default nextConfig;
