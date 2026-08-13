import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Product/category/bundle photos live in Supabase Storage's public
    // pos-media bucket (same project the POS app uses).
    remotePatterns: [{ protocol: "https", hostname: "*.supabase.co", pathname: "/storage/v1/object/public/**" }],
  },
};

export default nextConfig;
