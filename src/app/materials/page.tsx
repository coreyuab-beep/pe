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
  MoreHorizontal
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

export default function MaterialsPage() {
  const [searchKeyword, setSearchKeyword] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  // 模拟物料数据
  const materials = [
    {
      id: 'MAT-001',
      code: 'PW-001',
      name: '石蜡基材料',
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
      code: 'GR-001',
      name: '石墨烯',
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
      code: 'BN-001',
      name: '氮化硼',
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
    {
      id: 'MAT-004',
      code: 'EG-001',
      name: '膨胀石墨',
      category: '填料',
      specification: '工业级',
      unit: 'kg',
      currentStock: 200,
      minStock: 300,
      maxStock: 1000,
      supplierName: '山东石墨',
      batchNo: 'B202401004',
      productionDate: '2024-01-03',
      expiryDate: '2025-01-03',
      status: 'low_stock',
      price: 180,
    },
    {
      id: 'MAT-005',
      code: 'FA-001',
      name: '功能性添加剂',
      category: '添加剂',
      specification: '试剂级',
      unit: 'kg',
      currentStock: 450,
      minStock: 200,
      maxStock: 800,
      supplierName: '广东化工',
      batchNo: 'B202401005',
      productionDate: '2024-01-15',
      expiryDate: '2025-01-15',
      status: 'normal',
      price: 150,
    },
    {
      id: 'MAT-006',
      code: 'PW-002',
      name: '石蜡基材料-高纯',
      category: '基体材料',
      specification: '试剂级',
      unit: 'kg',
      currentStock: 1200,
      minStock: 500,
      maxStock: 2500,
      supplierName: '上海石化',
      batchNo: 'B202401006',
      productionDate: '2024-01-12',
      expiryDate: '2025-01-12',
      status: 'normal',
      price: 45,
    },
  ]

  // 模拟出入库记录
  const stockOperations = [
    {
      id: 'OP-001',
      materialName: '石蜡基材料',
      type: 'in',
      quantity: 200,
      beforeStock: 920,
      afterStock: 1120,
      batchNo: 'B202401001',
      reason: '采购入库',
      referenceNo: 'PO-2024-001',
      approvedBy: '张经理',
      createdAt: '2024-01-15 14:30',
      createdBy: '李四',
    },
    {
      id: 'OP-002',
      materialName: '石墨烯',
      type: 'out',
      quantity: 50,
      beforeStock: 95,
      afterStock: 45,
      batchNo: 'B202401002',
      reason: '生产领料',
      referenceNo: 'ORD-2024-001',
      approvedBy: '王主管',
      createdAt: '2024-01-15 10:15',
      createdBy: '赵六',
    },
    {
      id: 'OP-003',
      materialName: '氮化硼',
      type: 'in',
      quantity: 80,
      beforeStock: 0,
      afterStock: 80,
      batchNo: 'B202401003',
      reason: '采购入库',
      referenceNo: 'PO-2024-002',
      approvedBy: '张经理',
      createdAt: '2024-01-14 16:45',
      createdBy: '李四',
    },
    {
      id: 'OP-004',
      materialName: '膨胀石墨',
      type: 'out',
      quantity: 100,
      beforeStock: 300,
      afterStock: 200,
      batchNo: 'B202401004',
      reason: '生产领料',
      referenceNo: 'ORD-2024-002',
      approvedBy: '王主管',
      createdAt: '2024-01-14 09:20',
      createdBy: '赵六',
    },
    {
      id: 'OP-005',
      materialName: '功能性添加剂',
      type: 'in',
      quantity: 150,
      beforeStock: 300,
      afterStock: 450,
      batchNo: 'B202401005',
      reason: '采购入库',
      referenceNo: 'PO-2024-003',
      approvedBy: '张经理',
      createdAt: '2024-01-13 11:00',
      createdBy: '李四',
    },
  ]

  const getStatusBadge = (status: string) => {
    const config = {
      normal: { label: '正常', variant: 'default' as const, icon: CheckCircle2, color: 'green' },
      low_stock: { label: '库存不足', variant: 'destructive' as const, icon: AlertTriangle, color: 'red' },
      out_of_stock: { label: '缺货', variant: 'destructive' as const, icon: AlertTriangle, color: 'red' },
      expired: { label: '已过期', variant: 'secondary' as const, icon: AlertTriangle, color: 'gray' },
    }
    const configItem = config[status as keyof typeof config] || config.normal
    const Icon = configItem.icon
    return (
      <Badge variant={configItem.variant} className="gap-1">
        <Icon className="h-3 w-3" />
        {configItem.label}
      </Badge>
    )
  }

  const getOperationTypeBadge = (type: string) => {
    const config = {
      in: { label: '入库', icon: ArrowDown, color: 'text-green-600' },
      out: { label: '出库', icon: ArrowUp, color: 'text-red-600' },
      adjust: { label: '调整', icon: ArrowUpDown, color: 'text-blue-600' },
    }
    const configItem = config[type as keyof typeof config] || config.adjust
    const Icon = configItem.icon
    return (
      <span className={`flex items-center gap-1 text-sm font-medium ${configItem.color}`}>
        <Icon className="h-4 w-4" />
        {configItem.label}
      </span>
    )
  }

  const stockStats = {
    totalMaterials: materials.length,
    lowStockCount: materials.filter(m => m.status === 'low_stock').length,
    outOfStockCount: materials.filter(m => m.status === 'out_of_stock').length,
    totalValue: materials.reduce((sum, m) => sum + m.currentStock * m.price, 0),
  }

  return (
    <div className="space-y-6 p-6">
      {/* 页面标题和操作 */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">物料管理</h2>
          <p className="text-sm text-slate-500 mt-1">原材料库存与出入库管理</p>
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

      {/* 筛选和搜索栏 */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  placeholder="搜索物料代码、名称、供应商..."
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
                  <SelectValue placeholder="库存状态" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部状态</SelectItem>
                  <SelectItem value="normal">正常</SelectItem>
                  <SelectItem value="low_stock">库存不足</SelectItem>
                  <SelectItem value="out_of_stock">缺货</SelectItem>
                  <SelectItem value="expired">已过期</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 标签页 */}
      <Tabs defaultValue="inventory" className="space-y-4">
        <TabsList>
          <TabsTrigger value="inventory">库存管理</TabsTrigger>
          <TabsTrigger value="operations">出入库记录</TabsTrigger>
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
                      <TableHead>物料代码</TableHead>
                      <TableHead>物料名称</TableHead>
                      <TableHead>分类</TableHead>
                      <TableHead>规格</TableHead>
                      <TableHead>当前库存</TableHead>
                      <TableHead>库存状态</TableHead>
                      <TableHead>供应商</TableHead>
                      <TableHead>批次号</TableHead>
                      <TableHead>生产日期</TableHead>
                      <TableHead>有效期</TableHead>
                      <TableHead>单价</TableHead>
                      <TableHead className="text-right">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {materials.map((material) => (
                      <TableRow key={material.id}>
                        <TableCell className="font-medium">{material.code}</TableCell>
                        <TableCell>
                          <div className="font-medium text-slate-900">{material.name}</div>
                        </TableCell>
                        <TableCell>{material.category}</TableCell>
                        <TableCell>{material.specification}</TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="text-sm font-medium">
                              {material.currentStock} / {material.maxStock} {material.unit}
                            </div>
                            <Progress 
                              value={(material.currentStock / material.maxStock) * 100} 
                              className="h-1.5"
                            />
                            <div className="text-xs text-slate-500">
                              最小库存: {material.minStock} {material.unit}
                            </div>
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
                        <TableCell>{material.productionDate}</TableCell>
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
                                <ArrowDown className="mr-2 h-4 w-4" />
                                入库
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <ArrowUp className="mr-2 h-4 w-4" />
                                出库
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <ArrowUpDown className="mr-2 h-4 w-4" />
                                库存调整
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>
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

        <TabsContent value="operations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>出入库记录</CardTitle>
              <CardDescription>共 {stockOperations.length} 条操作记录</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>操作编号</TableHead>
                      <TableHead>物料名称</TableHead>
                      <TableHead>操作类型</TableHead>
                      <TableHead>数量</TableHead>
                      <TableHead>操作前</TableHead>
                      <TableHead>操作后</TableHead>
                      <TableHead>批次号</TableHead>
                      <TableHead>原因</TableHead>
                      <TableHead>关联单号</TableHead>
                      <TableHead>审批人</TableHead>
                      <TableHead>操作时间</TableHead>
                      <TableHead>操作人</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {stockOperations.map((operation) => (
                      <TableRow key={operation.id}>
                        <TableCell className="font-medium">{operation.id}</TableCell>
                        <TableCell>{operation.materialName}</TableCell>
                        <TableCell>{getOperationTypeBadge(operation.type)}</TableCell>
                        <TableCell className="font-medium">
                          {operation.type === 'in' ? '+' : '-'}{operation.quantity}
                        </TableCell>
                        <TableCell>{operation.beforeStock}</TableCell>
                        <TableCell>{operation.afterStock}</TableCell>
                        <TableCell>{operation.batchNo}</TableCell>
                        <TableCell>{operation.reason}</TableCell>
                        <TableCell>{operation.referenceNo || '-'}</TableCell>
                        <TableCell>{operation.approvedBy}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm text-slate-500">
                            <Calendar className="h-3 w-3" />
                            {operation.createdAt}
                          </div>
                        </TableCell>
                        <TableCell>{operation.createdBy}</TableCell>
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
