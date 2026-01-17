import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '登录 | Passive Edge',
  description: 'Passive Edge 生产测试管理系统 - 用户登录',
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
