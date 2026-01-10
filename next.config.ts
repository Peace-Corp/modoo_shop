import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'xwuvbztgpwhbwohontuh.supabase.co',
      },
    ],
  },
};

export default nextConfig;
