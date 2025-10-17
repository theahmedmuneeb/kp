import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: [process.env.S3_BUCKET_DOMAIN || "", "i.ibb.co"],
    unoptimized: true,
  },
  async rewrites() {
    return [
      {
        source: "/uploads/:path*",
        destination: `${process.env.API_STORAGE_URL}/:path*`,
      },
    ];
  }
};

export default nextConfig;
