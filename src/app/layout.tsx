import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext';
import { AppSidebar } from '@/components/app-sidebar';
import { RealtimeNotifications } from '@/components/realtime-notifications';

export const metadata: Metadata = {
  title: {
    default: 'Passive Edge | 生产测试管理系统',
    template: '%s | Passive Edge',
  },
  description: 'Passive Edge相变材料订单生产测试管理系统',
  keywords: [
    'Passive Edge',
    '相变材料',
    '生产管理',
    '测试管理',
    '配方管理',
    '物料管理',
  ],
  authors: [{ name: 'Passive Edge Team' }],
  generator: 'Passive Edge',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased bg-slate-100">
        <AuthProvider>
        <div className="flex h-screen overflow-hidden">
          {/* 侧边栏 */}
          <AppSidebar />
          
          {/* 主内容区域 */}
          <div className="flex flex-1 flex-col overflow-hidden">
            {/* 顶部导航栏 */}
            <header className="flex h-16 items-center justify-between border-b bg-white px-6">
              <div className="flex items-center gap-4">
                <h1 className="text-lg font-semibold text-slate-900">
                  {typeof window !== 'undefined' ? document.title : 'Passive Edge'}
                </h1>
              </div>
              <div className="flex items-center gap-4">
                <RealtimeNotifications />
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                  <span className="font-medium">系统在线</span>
                  <span className="text-slate-400">|</span>
                  <span className="text-xs text-slate-400">实时同步</span>
                </div>
              </div>
            </header>
            
            {/* 内容区域 */}
            <main className="flex-1 overflow-auto">
              {children}
            </main>
          </div>
        </div>
        </AuthProvider>
      </body>
    </html>
  );
}
