import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // 移除 outputFileTracingRoot 以避免 Vercel 部署路径问题
  // Vercel 会自动处理文件追踪
  /* config options here */
  allowedDevOrigins: ['*.dev.coze.site'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lf-coze-web-cdn.coze.cn',
        pathname: '/**',
      },
    ],
  },
  // 确保输出目录正确
  output: 'standalone',
};

export default nextConfig;
