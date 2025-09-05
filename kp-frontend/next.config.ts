import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: [process.env.S3_BUCKET_DOMAIN || "", "i.ibb.co"],
  },
};

export default nextConfig;
