'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Search,
  Plus,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  MoreHorizontal,
  ExternalLink,
  Package,
  Truck
} from 'lucide-react'
import { openShippingTracking } from '@/lib/shipping-utils'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export default function OrdersPage() {
  const [searchKeyword, setSearchKeyword] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)

  // 模拟订单数据
  const orders = [
    {
      id: 'PE-20240115-001J',
      customerName: '华为技术有限公司',
      contactPerson: '张三',
      contactPhone: '13800138001',
      type: '生产订单',
      status: 'processing',
      priority: 'high',
      quantity: 500,
      unit: 'kg',
      totalAmount: 250000,
      deliveryDate: '2024-01-20',
      orderDate: '2024-01-15',
      formulaName: 'PCM-HE-001',
      creatorCode: 'J',
    },
    {
      id: 'PE-20240115-002K',
      customerName: '比亚迪股份有限公司',
      contactPerson: '李四',
      contactPhone: '13800138002',
      type: '生产订单',
      status: 'pending',
      priority: 'medium',
      quantity: 1000,
      unit: 'kg',
      totalAmount: 450000,
      deliveryDate: '2024-01-25',
      orderDate: '2024-01-15',
      formulaName: 'PCM-TC-002',
      creatorCode: 'K',
    },
    {
      id: 'PE-20240114-003L',
      customerName: '宁德时代新能源',
      contactPerson: '王五',
      contactPhone: '13800138003',
      type: '测试订单',
      status: 'completed',
      priority: 'low',
      quantity: 750,
      unit: 'kg',
      totalAmount: 300000,
      deliveryDate: '2024-01-18',
      orderDate: '2024-01-14',
      formulaName: 'PCM-TE-003',
      creatorCode: 'L',
      shippingNo: 'SF1234567890123',
      shippingCompany: 'SF',
      shippingDate: '2024-01-18',
    },
    {
      id: 'PE-20240114-004M',
      customerName: '中航工业',
      contactPerson: '赵六',
      contactPhone: '13800138004',
      type: '生产订单',
      status: 'processing',
      priority: 'high',
      quantity: 300,
      unit: 'kg',
      totalAmount: 180000,
      deliveryDate: '2024-01-22',
      orderDate: '2024-01-14',
      formulaName: 'PCM-HE-004',
      creatorCode: 'M',
    },
    {
      id: 'PE-20240113-005J',
      customerName: '中国商飞',
      contactPerson: '孙七',
      contactPhone: '13800138005',
      type: '样品订单',
      status: 'pending',
      priority: 'medium',
      quantity: 200,
      unit: 'kg',
      totalAmount: 80000,
      deliveryDate: '2024-01-28',
      orderDate: '2024-01-13',
      formulaName: 'PCM-SA-005',
      creatorCode: 'J',
    },
    {
      id: 'PE-20240112-006K',
      customerName: '格力电器',
      contactPerson: '周八',
      contactPhone: '13800138006',
      type: '生产订单',
      status: 'cancelled',
      priority: 'low',
      quantity: 1500,
      unit: 'kg',
      totalAmount: 600000,
      deliveryDate: '2024-01-30',
      orderDate: '2024-01-12',
      formulaName: 'PCM-TC-006',
      creatorCode: 'K',
    },
  ]

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: '待处理', variant: 'secondary' as const },
      processing: { label: '生产中', variant: 'default' as const },
      completed: { label: '已完成', variant: 'outline' as const },
      cancelled: { label: '已取消', variant: 'destructive' as const },
    }
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  const getPriorityBadge = (priority: string) => {
    const priorityConfig = {
      low: { label: '低', variant: 'outline' as const, color: 'text-slate-600' },
      medium: { label: '中', variant: 'secondary' as const, color: 'text-blue-600' },
      high: { label: '高', variant: 'default' as const, color: 'text-orange-600' },
      urgent: { label: '紧急', variant: 'destructive' as const, color: 'text-red-600' },
    }
    const config = priorityConfig[priority as keyof typeof priorityConfig] || priorityConfig.low
    return (
      <Badge variant={config.variant} className={config.color}>
        {config.label}
      </Badge>
    )
  }

  return (
    <div className="space-y-6 p-6">
      {/* 页面标题和操作 */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">订单管理</h2>
          <p className="text-sm text-slate-500 mt-1">管理所有生产、测试和样品订单</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="h-4 w-4" />
            导出
          </Button>
          <Button size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            创建订单
          </Button>
        </div>
      </div>

      {/* 筛选和搜索栏 */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  placeholder="搜索订单号、客户名称、联系人..."
                  className="pl-10"
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="订单状态" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部状态</SelectItem>
                  <SelectItem value="pending">待处理</SelectItem>
                  <SelectItem value="processing">生产中</SelectItem>
                  <SelectItem value="completed">已完成</SelectItem>
                  <SelectItem value="cancelled">已取消</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 订单列表 */}
      <Card>
        <CardHeader>
          <CardTitle>订单列表</CardTitle>
          <CardDescription>共 {orders.length} 条记录</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>订单编号</TableHead>
                  <TableHead>客户名称</TableHead>
                  <TableHead>联系人</TableHead>
                  <TableHead>类型</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead>优先级</TableHead>
                  <TableHead>数量</TableHead>
                  <TableHead>订单金额</TableHead>
                  <TableHead>交货日期</TableHead>
                  <TableHead>配方</TableHead>
                  <TableHead>发货信息</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.id}</TableCell>
                    <TableCell>{order.customerName}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{order.contactPerson}</div>
                        <div className="text-slate-500">{order.contactPhone}</div>
                      </div>
                    </TableCell>
                    <TableCell>{order.type}</TableCell>
                    <TableCell>{getStatusBadge(order.status)}</TableCell>
                    <TableCell>{getPriorityBadge(order.priority)}</TableCell>
                    <TableCell>
                      {order.quantity} {order.unit}
                    </TableCell>
                    <TableCell>¥{order.totalAmount.toLocaleString()}</TableCell>
                    <TableCell>{order.deliveryDate}</TableCell>
                    <TableCell>{order.formulaName}</TableCell>
                    <TableCell>
                      {order.status === 'completed' && order.shippingNo ? (
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-sm">
                            <Truck className="h-3 w-3 text-slate-400" />
                            <span className="text-slate-600">{order.shippingNo}</span>
                            <button
                              onClick={() => openShippingTracking(order.shippingCompany, order.shippingNo)}
                              className="ml-1 p-0.5 hover:bg-slate-100 rounded transition-colors"
                              title="查询物流"
                            >
                              <ExternalLink className="h-3 w-3 text-blue-600" />
                            </button>
                          </div>
                          {order.shippingDate && (
                            <div className="text-xs text-slate-500">
                              {order.shippingDate}
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-sm text-slate-400">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>操作</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            查看详情
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            编辑订单
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" />
                            删除订单
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {/* 分页 */}
          <div className="flex items-center justify-end gap-2 mt-4">
            <Button variant="outline" size="sm" disabled={currentPage === 1}>
              上一页
            </Button>
            <div className="flex gap-1">
              <Button variant="outline" size="sm" className="w-8 h-8">
                1
              </Button>
              <Button variant="outline" size="sm" className="w-8 h-8">
                2
              </Button>
              <Button variant="outline" size="sm" className="w-8 h-8">
                3
              </Button>
            </div>
            <Button variant="outline" size="sm">
              下一页
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
