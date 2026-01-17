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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import { 
  Search, 
  Plus, 
  Filter, 
  Download,
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  AlertTriangle,
  CheckCircle2,
  Package,
  Building2,
  Calendar,
  MoreHorizontal,
  FileText,
  Printer,
  Eye,
  Check,
  X,
  Clock
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Progress } from '@/components/ui/progress'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

export default function MaterialsPage() {
  const [searchKeyword, setSearchKeyword] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedDocument, setSelectedDocument] = useState<any>(null)

  // 模拟物料数据
  const materials = [
    {
      id: 'MAT-001',
      code: 'L01',
      name: '',
      category: '基体材料',
      specification: '工业级',
      unit: 'kg',
      currentStock: 120,
      minStock: 500,
      maxStock: 2000,
      supplierName: '上海石化',
      batchNo: 'B202401001',
      productionDate: '2024-01-10',
      expiryDate: '2025-01-10',
      status: 'low_stock',
      price: 25.5,
    },
    {
      id: 'MAT-002',
      code: 'L02',
      name: '',
      category: '导热填料',
      specification: '纳米级',
      unit: 'kg',
      currentStock: 45,
      minStock: 100,
      maxStock: 500,
      supplierName: '深圳新材料',
      batchNo: 'B202401002',
      productionDate: '2024-01-08',
      expiryDate: '2025-01-08',
      status: 'low_stock',
      price: 850,
    },
    {
      id: 'MAT-003',
      code: 'H01',
      name: '',
      category: '导热填料',
      specification: '微米级',
      unit: 'kg',
      currentStock: 80,
      minStock: 150,
      maxStock: 600,
      supplierName: '江苏特陶',
      batchNo: 'B202401003',
      productionDate: '2024-01-05',
      expiryDate: '2025-01-05',
      status: 'low_stock',
      price: 320,
    },
  ]

  // 模拟入库单数据
  const inboundReceipts = [
    {
      id: 'IB-2024-001',
      receiptNo: 'IR202401001',
      supplierName: '上海石化',
      supplierContact: '张经理 13800138001',
      warehouse: 'A区1号库',
      totalQuantity: 200,
      totalAmount: 5100,
      deliveryDate: '2024-01-15',
      expectedDate: '2024-01-15',
      status: 'approved',
      operator: '李四',
      approver: '张经理',
      approvedAt: '2024-01-15 09:30',
      itemCount: 3,
      remarks: '正常入库',
    },
    {
      id: 'IB-2024-002',
      receiptNo: 'IR202401002',
      supplierName: '深圳新材料',
      supplierContact: '王总 13800138002',
      warehouse: 'A区2号库',
      totalQuantity: 50,
      totalAmount: 42500,
      deliveryDate: '2024-01-16',
      expectedDate: '2024-01-16',
      status: 'pending',
      operator: '王五',
      itemCount: 2,
      remarks: '等待审批',
    },
    {
      id: 'IB-2024-003',
      receiptNo: 'IR202401003',
      supplierName: '江苏特陶',
      supplierContact: '赵工 13800138003',
      warehouse: 'B区1号库',
      totalQuantity: 80,
      totalAmount: 25600,
      deliveryDate: '2024-01-14',
      expectedDate: '2024-01-14',
      status: 'completed',
      operator: '赵六',
      approver: '李主管',
      approvedAt: '2024-01-14 14:20',
      itemCount: 1,
      remarks: '已完成入库',
    },
  ]

  // 模拟出库单数据
  const outboundOrders = [
    {
      id: 'OB-2024-001',
      orderNo: 'OUT202401001',
      customerName: '华为技术有限公司',
      receiver: '张三',
      receiverContact: '13900139001',
      deliveryAddress: '深圳市龙岗区',
      warehouse: 'A区1号库',
      totalQuantity: 150,
      totalAmount: 3825,
      deliveryDate: '2024-01-15',
      status: 'approved',
      operator: '李四',
      approver: '张经理',
      approvedAt: '2024-01-15 10:15',
      relatedOrderNo: 'ORD-2024-001',
      itemCount: 2,
      remarks: '生产领料',
    },
    {
      id: 'OB-2024-002',
      orderNo: 'OUT202401002',
      customerName: '比亚迪股份有限公司',
      receiver: '李四',
      receiverContact: '13900139002',
      deliveryAddress: '深圳市坪山区',
      warehouse: 'A区2号库',
      totalQuantity: 300,
      totalAmount: 7650,
      deliveryDate: '2024-01-16',
      status: 'pending',
      operator: '王五',
      relatedOrderNo: 'ORD-2024-002',
      itemCount: 3,
      remarks: '等待审批',
    },
    {
      id: 'OB-2024-003',
      orderNo: 'OUT202401003',
      customerName: '宁德时代新能源',
      receiver: '王五',
      receiverContact: '13900139003',
      deliveryAddress: '宁德市蕉城区',
      warehouse: 'B区1号库',
      totalQuantity: 100,
      totalAmount: 2550,
      deliveryDate: '2024-01-14',
      status: 'completed',
      operator: '赵六',
      approver: '李主管',
      approvedAt: '2024-01-14 11:30',
      relatedOrderNo: 'ORD-2024-003',
      itemCount: 1,
      remarks: '已完成出库',
    },
  ]

  const getStatusBadge = (status: string) => {
    const config = {
      normal: { label: '正常', variant: 'default' as const, icon: CheckCircle2, color: 'green' },
      low_stock: { label: '库存不足', variant: 'destructive' as const, icon: AlertTriangle, color: 'red' },
      out_of_stock: { label: '缺货', variant: 'destructive' as const, icon: AlertTriangle, color: 'red' },
      expired: { label: '已过期', variant: 'secondary' as const, icon: AlertTriangle, color: 'gray' },
      draft: { label: '草稿', variant: 'secondary' as const, icon: FileText, color: 'gray' },
      pending: { label: '待审批', variant: 'default' as const, icon: Clock, color: 'blue' },
      approved: { label: '已审批', variant: 'outline' as const, icon: CheckCircle2, color: 'green' },
      rejected: { label: '已拒绝', variant: 'destructive' as const, icon: X, color: 'red' },
      completed: { label: '已完成', variant: 'outline' as const, icon: CheckCircle2, color: 'green' },
      cancelled: { label: '已取消', variant: 'secondary' as const, icon: X, color: 'gray' },
    }
    const configItem = config[status as keyof typeof config] || config.normal
    const Icon = configItem.icon as any
    return (
      <Badge variant={configItem.variant} className="gap-1">
        {Icon && <Icon className="h-3 w-3" />}
        {configItem.label}
      </Badge>
    )
  }

  const stockStats = {
    totalMaterials: materials.length,
    lowStockCount: materials.filter(m => m.status === 'low_stock').length,
    outOfStockCount: materials.filter(m => m.status === 'out_of_stock').length,
    totalValue: materials.reduce((sum, m) => sum + m.currentStock * m.price, 0),
  }

  // 入库单详情组件
  const InboundReceiptDetail = ({ receipt }: { receipt: any }) => (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 border-b pb-4">
        <div>
          <Label className="text-slate-500">入库单号</Label>
          <p className="font-semibold text-lg">{receipt.receiptNo}</p>
        </div>
        <div className="text-right">
          <Label className="text-slate-500">状态</Label>
          <div className="mt-1">{getStatusBadge(receipt.status)}</div>
        </div>
        <div>
          <Label className="text-slate-500">供应商</Label>
          <p className="font-medium">{receipt.supplierName}</p>
        </div>
        <div>
          <Label className="text-slate-500">联系方式</Label>
          <p className="font-medium">{receipt.supplierContact}</p>
        </div>
        <div>
          <Label className="text-slate-500">入库仓库</Label>
          <p className="font-medium">{receipt.warehouse}</p>
        </div>
        <div>
          <Label className="text-slate-500">送达日期</Label>
          <p className="font-medium">{receipt.deliveryDate}</p>
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-3">入库明细</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>物料编号</TableHead>
              <TableHead>规格</TableHead>
              <TableHead>批次号</TableHead>
              <TableHead>单位</TableHead>
              <TableHead>数量</TableHead>
              <TableHead>单价</TableHead>
              <TableHead>金额</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>L01</TableCell>
              <TableCell>工业级</TableCell>
              <TableCell>B202401001</TableCell>
              <TableCell>kg</TableCell>
              <TableCell>200</TableCell>
              <TableCell>¥25.5</TableCell>
              <TableCell>¥5,100</TableCell>
            </TableRow>
            {receipt.itemCount > 1 && (
              <TableRow>
                <TableCell>L02</TableCell>
                <TableCell>纳米级</TableCell>
                <TableCell>B202401002</TableCell>
                <TableCell>kg</TableCell>
                <TableCell>50</TableCell>
                <TableCell>¥850</TableCell>
                <TableCell>¥42,500</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-between items-center pt-4 border-t">
        <div>
          <p className="text-sm text-slate-500">操作人: {receipt.operator}</p>
          {receipt.approver && (
            <p className="text-sm text-slate-500">审批人: {receipt.approver} ({receipt.approvedAt})</p>
          )}
        </div>
        <div className="text-right">
          <p className="text-sm text-slate-500">合计数量: {receipt.totalQuantity} kg</p>
          <p className="text-2xl font-bold">合计金额: ¥{receipt.totalAmount.toLocaleString()}</p>
        </div>
      </div>

      <div className="flex gap-2">
        <Button variant="outline" className="flex-1">
          <Printer className="mr-2 h-4 w-4" />
          打印入库单
        </Button>
        <Button variant="outline" className="flex-1">
          <Download className="mr-2 h-4 w-4" />
          导出Excel
        </Button>
        {receipt.status === 'pending' && (
          <>
            <Button variant="default" className="flex-1">
              <Check className="mr-2 h-4 w-4" />
              审批通过
            </Button>
            <Button variant="destructive" className="flex-1">
              <X className="mr-2 h-4 w-4" />
              拒绝
            </Button>
          </>
        )}
      </div>
    </div>
  )

  // 出库单详情组件
  const OutboundOrderDetail = ({ order }: { order: any }) => (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 border-b pb-4">
        <div>
          <Label className="text-slate-500">出库单号</Label>
          <p className="font-semibold text-lg">{order.orderNo}</p>
        </div>
        <div className="text-right">
          <Label className="text-slate-500">状态</Label>
          <div className="mt-1">{getStatusBadge(order.status)}</div>
        </div>
        <div>
          <Label className="text-slate-500">客户名称</Label>
          <p className="font-medium">{order.customerName}</p>
        </div>
        <div>
          <Label className="text-slate-500">联系人</Label>
          <p className="font-medium">{order.receiver} ({order.receiverContact})</p>
        </div>
        <div>
          <Label className="text-slate-500">出库仓库</Label>
          <p className="font-medium">{order.warehouse}</p>
        </div>
        <div>
          <Label className="text-slate-500">送货地址</Label>
          <p className="font-medium">{order.deliveryAddress}</p>
        </div>
        {order.relatedOrderNo && (
          <div className="col-span-2">
            <Label className="text-slate-500">关联订单</Label>
            <p className="font-medium">{order.relatedOrderNo}</p>
          </div>
        )}
      </div>

      <div>
        <h3 className="font-semibold mb-3">出库明细</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>物料编号</TableHead>
              <TableHead>规格</TableHead>
              <TableHead>批次号</TableHead>
              <TableHead>单位</TableHead>
              <TableHead>数量</TableHead>
              <TableHead>单价</TableHead>
              <TableHead>金额</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>L01</TableCell>
              <TableCell>工业级</TableCell>
              <TableCell>B202401001</TableCell>
              <TableCell>kg</TableCell>
              <TableCell>150</TableCell>
              <TableCell>¥25.5</TableCell>
              <TableCell>¥3,825</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-between items-center pt-4 border-t">
        <div>
          <p className="text-sm text-slate-500">操作人: {order.operator}</p>
          {order.approver && (
            <p className="text-sm text-slate-500">审批人: {order.approver} ({order.approvedAt})</p>
          )}
        </div>
        <div className="text-right">
          <p className="text-sm text-slate-500">合计数量: {order.totalQuantity} kg</p>
          <p className="text-2xl font-bold">合计金额: ¥{order.totalAmount.toLocaleString()}</p>
        </div>
      </div>

      <div className="flex gap-2">
        <Button variant="outline" className="flex-1">
          <Printer className="mr-2 h-4 w-4" />
          打印出库单
        </Button>
        <Button variant="outline" className="flex-1">
          <Download className="mr-2 h-4 w-4" />
          导出Excel
        </Button>
        {order.status === 'pending' && (
          <>
            <Button variant="default" className="flex-1">
              <Check className="mr-2 h-4 w-4" />
              审批通过
            </Button>
            <Button variant="destructive" className="flex-1">
              <X className="mr-2 h-4 w-4" />
              拒绝
            </Button>
          </>
        )}
      </div>
    </div>
  )

  return (
    <div className="space-y-6 p-6">
      {/* 页面标题和操作 */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">物料管理</h2>
          <p className="text-sm text-slate-500 mt-1">原材料库存与出入库单据管理</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="h-4 w-4" />
            导出数据
          </Button>
          <Button size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            添加物料
          </Button>
        </div>
      </div>

      {/* 库存统计卡片 */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">
              物料总数
            </CardTitle>
            <Package className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{stockStats.totalMaterials}</div>
            <p className="text-xs text-slate-500 mt-1">种原材料</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">
              库存不足
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stockStats.lowStockCount}</div>
            <p className="text-xs text-slate-500 mt-1">需要补货</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">
              缺货物料
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stockStats.outOfStockCount}</div>
            <p className="text-xs text-slate-500 mt-1">紧急采购</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">
              库存总值
            </CardTitle>
            <Package className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              ¥{stockStats.totalValue.toLocaleString()}
            </div>
            <p className="text-xs text-slate-500 mt-1">当前库存价值</p>
          </CardContent>
        </Card>
      </div>

      {/* 标签页 */}
      <Tabs defaultValue="inventory" className="space-y-4">
        <TabsList>
          <TabsTrigger value="inventory">库存管理</TabsTrigger>
          <TabsTrigger value="inbound">入库单管理</TabsTrigger>
          <TabsTrigger value="outbound">出库单管理</TabsTrigger>
        </TabsList>

        <TabsContent value="inventory" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>库存列表</CardTitle>
              <CardDescription>共 {materials.length} 条物料记录</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>物料编号</TableHead>
                      <TableHead>分类</TableHead>
                      <TableHead>当前库存</TableHead>
                      <TableHead>库存状态</TableHead>
                      <TableHead>供应商</TableHead>
                      <TableHead>批次号</TableHead>
                      <TableHead>有效期</TableHead>
                      <TableHead>单价</TableHead>
                      <TableHead className="text-right">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {materials.map((material) => (
                      <TableRow key={material.id}>
                        <TableCell className="font-medium">{material.code}</TableCell>
                        <TableCell>{material.category}</TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="text-sm font-medium">
                              {material.currentStock} / {material.maxStock} {material.unit}
                            </div>
                            <Progress 
                              value={(material.currentStock / material.maxStock) * 100} 
                              className="h-1.5"
                            />
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(material.status)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm">
                            <Building2 className="h-4 w-4 text-slate-400" />
                            {material.supplierName}
                          </div>
                        </TableCell>
                        <TableCell>{material.batchNo}</TableCell>
                        <TableCell>{material.expiryDate}</TableCell>
                        <TableCell>¥{material.price.toFixed(2)}</TableCell>
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
                                <FileText className="mr-2 h-4 w-4" />
                                创建入库单
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <ArrowUp className="mr-2 h-4 w-4" />
                                创建出库单
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>
                                <Eye className="mr-2 h-4 w-4" />
                                查看详情
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                编辑物料
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inbound" className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">入库单列表</h3>
              <p className="text-sm text-slate-500">共 {inboundReceipts.length} 张入库单</p>
            </div>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              创建入库单
            </Button>
          </div>

          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>入库单号</TableHead>
                      <TableHead>供应商</TableHead>
                      <TableHead>入库仓库</TableHead>
                      <TableHead>送达日期</TableHead>
                      <TableHead>物料数量</TableHead>
                      <TableHead>总金额</TableHead>
                      <TableHead>状态</TableHead>
                      <TableHead>操作人</TableHead>
                      <TableHead className="text-right">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {inboundReceipts.map((receipt) => (
                      <TableRow key={receipt.id}>
                        <TableCell className="font-medium">{receipt.receiptNo}</TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{receipt.supplierName}</div>
                            <div className="text-xs text-slate-500">{receipt.supplierContact}</div>
                          </div>
                        </TableCell>
                        <TableCell>{receipt.warehouse}</TableCell>
                        <TableCell>{receipt.deliveryDate}</TableCell>
                        <TableCell>{receipt.totalQuantity} kg</TableCell>
                        <TableCell>¥{receipt.totalAmount.toLocaleString()}</TableCell>
                        <TableCell>{getStatusBadge(receipt.status)}</TableCell>
                        <TableCell>{receipt.operator}</TableCell>
                        <TableCell className="text-right">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="sm" onClick={() => setSelectedDocument(receipt)}>
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>入库单详情</DialogTitle>
                                <DialogDescription>查看入库单完整信息</DialogDescription>
                              </DialogHeader>
                              {selectedDocument && <InboundReceiptDetail receipt={selectedDocument} />}
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="outbound" className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">出库单列表</h3>
              <p className="text-sm text-slate-500">共 {outboundOrders.length} 张出库单</p>
            </div>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              创建出库单
            </Button>
          </div>

          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>出库单号</TableHead>
                      <TableHead>客户名称</TableHead>
                      <TableHead>出库仓库</TableHead>
                      <TableHead>送达日期</TableHead>
                      <TableHead>物料数量</TableHead>
                      <TableHead>总金额</TableHead>
                      <TableHead>状态</TableHead>
                      <TableHead>关联订单</TableHead>
                      <TableHead className="text-right">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {outboundOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.orderNo}</TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{order.customerName}</div>
                            <div className="text-xs text-slate-500">{order.receiver}</div>
                          </div>
                        </TableCell>
                        <TableCell>{order.warehouse}</TableCell>
                        <TableCell>{order.deliveryDate}</TableCell>
                        <TableCell>{order.totalQuantity} kg</TableCell>
                        <TableCell>¥{order.totalAmount.toLocaleString()}</TableCell>
                        <TableCell>{getStatusBadge(order.status)}</TableCell>
                        <TableCell>{order.relatedOrderNo || '-'}</TableCell>
                        <TableCell className="text-right">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="sm" onClick={() => setSelectedDocument(order)}>
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>出库单详情</DialogTitle>
                                <DialogDescription>查看出库单完整信息</DialogDescription>
                              </DialogHeader>
                              {selectedDocument && <OutboundOrderDetail order={selectedDocument} />}
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
