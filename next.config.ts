import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // ✅ Giữ nguyên format gốc, ưu tiên WebP (lossless hơn JPEG)
    formats: ["image/webp", "image/avif"],
    // ✅ Cache ảnh lâu hơn (1 năm) để tăng tốc
    minimumCacheTTL: 31536000,
    // ⚠️ quality phải set ở từng <Image quality={100}> component, không set ở đây được
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.fbcdn.net",
      },
      {
        protocol: "https",
        hostname: "www.facebook.com",
      },
      {
        protocol: "https",
        hostname: "**.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "**.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "placehold.co",
      },
      {
        protocol: "https",
        hostname: "via.placeholder.com",
      },
      {
        protocol: "https",
        hostname: "bizweb.dktcdn.net",
      },
      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
      },
      {
        protocol: "https",
        hostname: "encrypted-tbn0.gstatic.com",
      },
      {
        protocol: "https",
        hostname: "inkythuatso.com",
      },
    ],
  },
};

export default nextConfig;
