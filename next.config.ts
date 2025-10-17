import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${process.env.NEXT_PUBLIC_API_BASE}/api/:path*`,
      },
    ];
  },
  images: {
    domains: ["res.cloudinary.com"], // ✅ allow loading images from Cloudinary
  },
};

export default nextConfig;
