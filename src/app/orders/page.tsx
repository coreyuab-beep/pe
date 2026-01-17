'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
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
  Truck,
  X,
  Save
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
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Textarea } from '@/components/ui/textarea'

export default function OrdersPage() {
  const [searchKeyword, setSearchKeyword] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedOrder, setSelectedOrder] = useState<any>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false)
  const [cancelReason, setCancelReason] = useState('')
  const [editForm, setEditForm] = useState<any>(null)

  // 判断订单是否可以编辑
  const canEditOrder = (order: any) => {
    return order.status === 'pending' || order.status === 'processing'
  }

  // 判断订单是否可以取消
  const canCancelOrder = (order: any) => {
    return order.status !== 'completed' && order.status !== 'cancelled'
  }

  // 处理编辑订单
  const handleEditOrder = (order: any) => {
    setSelectedOrder(order)
    setEditForm({
      ...order,
    })
    setIsEditDialogOpen(true)
  }

  // 保存编辑
  const handleSaveEdit = () => {
    // 这里添加保存逻辑
    console.log('保存订单编辑:', editForm)
    setIsEditDialogOpen(false)
    setSelectedOrder(null)
    setEditForm(null)
  }

  // 处理取消订单
  const handleCancelOrder = (order: any) => {
    setSelectedOrder(order)
    setCancelReason('')
    setIsCancelDialogOpen(true)
  }

  // 确认取消订单
  const handleConfirmCancel = () => {
    if (!cancelReason.trim()) {
      alert('请输入取消原因')
      return
    }
    // 这里添加取消逻辑
    console.log('取消订单:', selectedOrder.id, '原因:', cancelReason)
    setIsCancelDialogOpen(false)
    setSelectedOrder(null)
    setCancelReason('')
  }

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
      {/* 编辑订单对话框 */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>编辑订单</DialogTitle>
            <DialogDescription>
              修改订单信息，订单编号: {selectedOrder?.id}
            </DialogDescription>
          </DialogHeader>
          {editForm && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="customerName">客户名称 *</Label>
                  <Input
                    id="customerName"
                    value={editForm.customerName}
                    onChange={(e) => setEditForm({ ...editForm, customerName: e.target.value })}
                    disabled={editForm.status === 'processing'}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactPerson">联系人 *</Label>
                  <Input
                    id="contactPerson"
                    value={editForm.contactPerson}
                    onChange={(e) => setEditForm({ ...editForm, contactPerson: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contactPhone">联系电话 *</Label>
                  <Input
                    id="contactPhone"
                    value={editForm.contactPhone}
                    onChange={(e) => setEditForm({ ...editForm, contactPhone: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">订单类型 *</Label>
                  <Select
                    value={editForm.type}
                    onValueChange={(value) => setEditForm({ ...editForm, type: value })}
                    disabled={editForm.status === 'processing'}
                  >
                    <SelectTrigger id="type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="生产订单">生产订单</SelectItem>
                      <SelectItem value="测试订单">测试订单</SelectItem>
                      <SelectItem value="样品订单">样品订单</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="quantity">数量 *</Label>
                  <Input
                    id="quantity"
                    type="number"
                    value={editForm.quantity}
                    onChange={(e) => setEditForm({ ...editForm, quantity: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="unit">单位</Label>
                  <Input
                    id="unit"
                    value={editForm.unit}
                    onChange={(e) => setEditForm({ ...editForm, unit: e.target.value })}
                    disabled
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="priority">优先级</Label>
                  <Select
                    value={editForm.priority}
                    onValueChange={(value) => setEditForm({ ...editForm, priority: value })}
                  >
                    <SelectTrigger id="priority">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">低</SelectItem>
                      <SelectItem value="medium">中</SelectItem>
                      <SelectItem value="high">高</SelectItem>
                      <SelectItem value="urgent">紧急</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="deliveryDate">交货日期 *</Label>
                  <Input
                    id="deliveryDate"
                    type="date"
                    value={editForm.deliveryDate}
                    onChange={(e) => setEditForm({ ...editForm, deliveryDate: e.target.value })}
                  />
                </div>
              </div>
              {editForm.status === 'processing' && (
                <Alert>
                  <AlertDescription>
                    该订单已进入生产状态，客户名称和订单类型无法修改。
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              <X className="mr-2 h-4 w-4" />
              取消
            </Button>
            <Button onClick={handleSaveEdit}>
              <Save className="mr-2 h-4 w-4" />
              保存修改
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 取消订单对话框 */}
      <Dialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>取消订单</DialogTitle>
            <DialogDescription>
              确定要取消订单 {selectedOrder?.id} 吗？此操作不可撤销。
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {selectedOrder && (
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">客户名称:</span>
                  <span className="font-medium">{selectedOrder.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">订单数量:</span>
                  <span className="font-medium">{selectedOrder.quantity} {selectedOrder.unit}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">订单金额:</span>
                  <span className="font-medium">¥{selectedOrder.totalAmount.toLocaleString()}</span>
                </div>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="cancelReason">取消原因 *</Label>
              <Textarea
                id="cancelReason"
                placeholder="请输入取消原因..."
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                rows={3}
              />
            </div>
            <Alert>
              <AlertDescription>
                取消订单后，相关的物料出库单将被同步取消，库存会自动回退。
              </AlertDescription>
            </Alert>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCancelDialogOpen(false)}>
              <X className="mr-2 h-4 w-4" />
              返回
            </Button>
            <Button variant="destructive" onClick={handleConfirmCancel}>
              <X className="mr-2 h-4 w-4" />
              确认取消
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
                          <DropdownMenuItem
                            onClick={() => handleEditOrder(order)}
                            disabled={!canEditOrder(order)}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            编辑订单
                          </DropdownMenuItem>
                          {canCancelOrder(order) && (
                            <DropdownMenuItem
                              onClick={() => handleCancelOrder(order)}
                              className="text-red-600"
                            >
                              <X className="mr-2 h-4 w-4" />
                              取消订单
                            </DropdownMenuItem>
                          )}
                          {order.status === 'cancelled' && (
                            <DropdownMenuItem className="text-slate-400" disabled>
                              <X className="mr-2 h-4 w-4" />
                              订单已取消
                            </DropdownMenuItem>
                          )}
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
