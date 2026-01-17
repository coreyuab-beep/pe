'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Bell, Check, AlertTriangle, Package, FileText, TrendingUp, FlaskConical, X } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ScrollArea } from '@/components/ui/scroll-area'

interface Notification {
  id: string
  type: 'stock_low' | 'stock_out' | 'order_created' | 'order_status_changed' | 'test_completed' | 'formula_updated' | 'document_approved' | 'document_rejected'
  title: string
  message: string
  relatedId?: string
  relatedNo?: string
  isRead: boolean
  priority: 'low' | 'medium' | 'high'
  timestamp: Date
}

export function RealtimeNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [showDropdown, setShowDropdown] = useState(false)

  useEffect(() => {
    // 模拟实时通知
    const mockNotifications: Notification[] = [
      {
        id: '1',
        type: 'stock_low',
        title: '库存预警',
        message: '石蜡基材料库存不足，当前库存120kg，最小库存500kg',
        relatedId: 'MAT-001',
        relatedNo: 'PW-001',
        isRead: false,
        priority: 'high',
        timestamp: new Date(Date.now() - 5 * 60000),
      },
      {
        id: '2',
        type: 'document_approved',
        title: '入库单已审批',
        message: '入库单 IR202401001 已通过审批',
        relatedId: 'IB-2024-001',
        relatedNo: 'IR202401001',
        isRead: false,
        priority: 'medium',
        timestamp: new Date(Date.now() - 15 * 60000),
      },
      {
        id: '3',
        type: 'order_created',
        title: '新订单创建',
        message: '订单 ORD-2024-006 已创建，待处理',
        relatedId: 'ORD-2024-006',
        relatedNo: 'ORD-2024-006',
        isRead: false,
        priority: 'medium',
        timestamp: new Date(Date.now() - 30 * 60000),
      },
      {
        id: '4',
        type: 'test_completed',
        title: '测试完成',
        message: '测试 T202401001 已完成，测试合格',
        relatedId: 'TEST-2024-001',
        relatedNo: 'T202401001',
        isRead: true,
        priority: 'medium',
        timestamp: new Date(Date.now() - 60 * 60000),
      },
      {
        id: '5',
        type: 'formula_updated',
        title: '配方更新',
        message: '配方 PCM-HE-001 已更新至 v1.2 版本',
        relatedId: 'FM-001',
        relatedNo: 'PCM-HE-001',
        isRead: true,
        priority: 'low',
        timestamp: new Date(Date.now() - 120 * 60000),
      },
    ]

    setNotifications(mockNotifications)
    setUnreadCount(mockNotifications.filter(n => !n.isRead).length)

    // 模拟实时更新
    const interval = setInterval(() => {
      // 每30秒模拟一次新通知
      if (Math.random() > 0.7) {
        const types = ['stock_low', 'document_approved', 'order_created', 'test_completed']
        const randomType = types[Math.floor(Math.random() * types.length)] as any
        
        const newNotification: Notification = {
          id: Date.now().toString(),
          type: randomType,
          title: getNotificationTitle(randomType),
          message: getNotificationMessage(randomType),
          isRead: false,
          priority: randomType === 'stock_low' ? 'high' : 'medium',
          timestamp: new Date(),
        }

        setNotifications(prev => [newNotification, ...prev].slice(0, 10))
        setUnreadCount(prev => prev + 1)
      }
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  const getNotificationTitle = (type: string): string => {
    const titles: Record<string, string> = {
      stock_low: '库存预警',
      stock_out: '缺货预警',
      order_created: '新订单创建',
      order_status_changed: '订单状态变更',
      test_completed: '测试完成',
      formula_updated: '配方更新',
      document_approved: '单据已审批',
      document_rejected: '单据已拒绝',
    }
    return titles[type] || '系统通知'
  }

  const getNotificationMessage = (type: string): string => {
    const messages: Record<string, string> = {
      stock_low: '物料库存不足，请及时补货',
      stock_out: '物料已缺货，紧急采购',
      order_created: '新订单已创建，请及时处理',
      order_status_changed: '订单状态已更新',
      test_completed: '测试已完成，请查看结果',
      formula_updated: '配方已更新至新版本',
      document_approved: '单据已通过审批',
      document_rejected: '单据已被拒绝',
    }
    return messages[type] || '系统通知'
  }

  const getNotificationIcon = (type: string) => {
    const icons: Record<string, any> = {
      stock_low: AlertTriangle,
      stock_out: AlertTriangle,
      order_created: FileText,
      order_status_changed: TrendingUp,
      test_completed: FlaskConical,
      formula_updated: FlaskConical,
      document_approved: Check,
      document_rejected: X,
    }
    return icons[type] || Bell
  }

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, isRead: true } : n))
    )
    setUnreadCount(prev => Math.max(0, prev - 1))
  }

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
    setUnreadCount(0)
  }

  const formatTime = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return '刚刚'
    if (minutes < 60) return `${minutes}分钟前`
    if (hours < 24) return `${hours}小时前`
    return `${days}天前`
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500'
      case 'medium':
        return 'bg-orange-500'
      case 'low':
        return 'bg-blue-500'
      default:
        return 'bg-gray-500'
    }
  }

  return (
    <DropdownMenu open={showDropdown} onOpenChange={setShowDropdown}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-red-500">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-96">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>通知中心</span>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-auto p-1 text-xs"
              onClick={(e) => {
                e.stopPropagation()
                markAllAsRead()
              }}
            >
              全部已读
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <ScrollArea className="h-80">
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-sm text-slate-500">
              暂无通知
            </div>
          ) : (
            notifications.map((notification) => {
              const Icon = getNotificationIcon(notification.type)
              return (
                <DropdownMenuItem
                  key={notification.id}
                  className="p-3 cursor-pointer"
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex gap-3 w-full">
                    <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${
                      notification.isRead ? 'bg-slate-100' : getPriorityColor(notification.priority)
                    }`}>
                      <Icon className={`h-4 w-4 ${notification.isRead ? 'text-slate-600' : 'text-white'}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className={`text-sm font-medium ${notification.isRead ? 'text-slate-600' : 'text-slate-900'}`}>
                          {notification.title}
                        </p>
                        {!notification.isRead && (
                          <div className="h-2 w-2 rounded-full bg-blue-500 flex-shrink-0 mt-1.5" />
                        )}
                      </div>
                      <p className="text-sm text-slate-500 mt-1 line-clamp-2">
                        {notification.message}
                      </p>
                      {notification.relatedNo && (
                        <p className="text-xs text-slate-400 mt-1">
                          关联单号: {notification.relatedNo}
                        </p>
                      )}
                      <p className="text-xs text-slate-400 mt-1">
                        {formatTime(notification.timestamp)}
                      </p>
                    </div>
                  </div>
                </DropdownMenuItem>
              )
            })
          )}
        </ScrollArea>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-center justify-center text-sm text-slate-600">
          查看全部通知
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
