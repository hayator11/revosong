import type { NextConfig } from "next";

// Force rebuild trigger: v4 - Google OAuth callback fix, Site URL update
const nextConfig: NextConfig = {
  // 画像最適化設定
  images: {
    // 外部ドメインの画像を最適化
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.youtube.com',
        pathname: '/vi/**',
      },
      {
        protocol: 'https',
        hostname: '**.soundcloud.com',
      },
      {
        protocol: 'https',
        hostname: '**.spotify.com',
      },
      {
        protocol: 'https',
        hostname: '**.nicovideo.jp',
      },
      {
        protocol: 'https',
        hostname: '**.discordapp.com',
      },
      {
        protocol: 'https',
        hostname: '**.twimg.com',
      },
      {
        protocol: 'https',
        hostname: 'i.ytimg.com',
      },
      {
        protocol: 'https',
        hostname: 'platform.instagram.com',
      },
    ],
    // WebP 形式で配信（自動的に対応ブラウザへ配信）
    formats: ['image/avif', 'image/webp'],
    // キャッシング設定
    minimumCacheTTL: 86400 * 30, // 30 日間キャッシュ
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // その他の設定
  reactStrictMode: true,
};

export default nextConfig;
