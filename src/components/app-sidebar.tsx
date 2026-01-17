'use client'

import * as React from 'react'
import { BookOpen, Database, FlaskConical, LayoutDashboard, Package, Settings, TestTube2, ChevronRight, LogOut, LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/AuthContext'

export interface SidebarItem {
  title: string
  href: string
  icon: LucideIcon
  badge?: string
}

const sidebarItems: SidebarItem[] = [
  {
    title: '数据仪表盘',
    href: '/',
    icon: LayoutDashboard,
  },
  {
    title: '订单管理',
    href: '/orders',
    icon: BookOpen,
  },
  {
    title: '配方管理',
    href: '/formulas',
    icon: FlaskConical,
  },
  {
    title: '物料管理',
    href: '/materials',
    icon: Package,
  },
  {
    title: '配方测试',
    href: '/tests',
    icon: TestTube2,
  },
  {
    title: '数据统计',
    href: '/statistics',
    icon: Database,
  },
  {
    title: '系统设置',
    href: '/settings',
    icon: Settings,
  },
]

export function AppSidebar() {
  const pathname = usePathname()
  const { user, logout } = useAuth()

  const handleLogout = async () => {
    await logout()
  }

  return (
    <div className="flex h-full w-64 flex-col border-r bg-slate-50/50">
      {/* Logo 区域 */}
      <div className="flex h-16 items-center border-b px-6">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600">
            <FlaskConical className="h-5 w-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-slate-900">Passive Edge</span>
            <span className="text-[10px] text-slate-500">生产测试管理系统</span>
          </div>
        </div>
      </div>

      {/* 导航菜单 */}
      <div className="flex-1 overflow-auto py-4">
        <nav className="space-y-1 px-3">
          {sidebarItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'group flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-all',
                  isActive
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-slate-600 hover:bg-white hover:text-slate-900'
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={cn(
                      'h-5 w-5 transition-colors',
                      isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'
                    )}
                  />
                  <span>{item.title}</span>
                </div>
                {item.badge && (
                  <Badge variant="secondary" className="text-xs">
                    {item.badge}
                  </Badge>
                )}
                {isActive && (
                  <ChevronRight className="ml-auto h-4 w-4 text-blue-600" />
                )}
              </Link>
            )
          })}
        </nav>
      </div>

      {/* 用户信息区域 */}
      <div className="border-t bg-white p-4">
        <div className="flex items-center gap-3 rounded-lg border p-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-sm font-medium text-white">
            {user?.username?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="truncate text-sm font-medium text-slate-900">{user?.username || '用户'}</p>
            <p className="truncate text-xs text-slate-500">
              {user?.role === 'admin' ? '管理员' : '普通用户'}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-slate-400 hover:text-red-600"
            onClick={handleLogout}
            title="退出登录"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
