'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  BookOpen, 
  FlaskConical, 
  Package, 
  TestTube2, 
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowRight
} from 'lucide-react'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { Bar, BarChart, Line, LineChart, Pie, PieChart, Cell, XAxis, YAxis, ResponsiveContainer } from 'recharts'

export default function DashboardPage() {
  // 模拟数据
  const stats = [
    {
      title: '总订单数',
      value: '1,284',
      change: '+12.5%',
      trend: 'up',
      icon: BookOpen,
      color: 'blue',
    },
    {
      title: '待处理订单',
      value: '48',
      change: '-3.2%',
      trend: 'down',
      icon: Clock,
      color: 'orange',
    },
    {
      title: '配方库数量',
      value: '156',
      change: '+8.1%',
      trend: 'up',
      icon: FlaskConical,
      color: 'purple',
    },
    {
      title: '低库存物料',
      value: '12',
      change: '+2',
      trend: 'up',
      icon: AlertTriangle,
      color: 'red',
    },
    {
      title: '本月测试',
      value: '89',
      change: '+15.3%',
      trend: 'up',
      icon: TestTube2,
      color: 'green',
    },
    {
      title: '物料种类',
      value: '234',
      change: '+5.4%',
      trend: 'up',
      icon: Package,
      color: 'indigo',
    },
  ]

  const orderData = [
    { month: '1月', orders: 120, tests: 45 },
    { month: '2月', orders: 135, tests: 52 },
    { month: '3月', orders: 142, tests: 48 },
    { month: '4月', orders: 158, tests: 61 },
    { month: '5月', orders: 175, tests: 68 },
    { month: '6月', orders: 192, tests: 75 },
  ]

  const formulaDistribution = [
    { name: '相变储能材料', value: 35, color: '#3b82f6' },
    { name: '热控材料', value: 28, color: '#8b5cf6' },
    { name: '保温材料', value: 22, color: '#06b6d4' },
    { name: '功能性材料', value: 15, color: '#10b981' },
  ]

  const recentOrders = [
    {
      orderNo: 'ORD-2024-001',
      customer: '华为技术有限公司',
      status: 'processing',
      quantity: '500kg',
      date: '2024-01-15',
    },
    {
      orderNo: 'ORD-2024-002',
      customer: '比亚迪股份有限公司',
      status: 'pending',
      quantity: '1000kg',
      date: '2024-01-15',
    },
    {
      orderNo: 'ORD-2024-003',
      customer: '宁德时代新能源',
      status: 'completed',
      quantity: '750kg',
      date: '2024-01-14',
    },
    {
      orderNo: 'ORD-2024-004',
      customer: '中航工业',
      status: 'processing',
      quantity: '300kg',
      date: '2024-01-14',
    },
    {
      orderNo: 'ORD-2024-005',
      customer: '中国商飞',
      status: 'pending',
      quantity: '200kg',
      date: '2024-01-13',
    },
  ]

  const lowStockMaterials = [
    { name: '石蜡基材料', stock: 120, minStock: 500, unit: 'kg' },
    { name: '石墨烯', stock: 45, minStock: 100, unit: 'kg' },
    { name: '氮化硼', stock: 80, minStock: 150, unit: 'kg' },
    { name: '膨胀石墨', stock: 200, minStock: 300, unit: 'kg' },
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

  return (
    <div className="space-y-6 p-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">数据仪表盘</h2>
          <p className="text-sm text-slate-500 mt-1">实时监控业务运营状态</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            导出报告
          </Button>
          <Button size="sm">
            新建订单
          </Button>
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {stats.map((stat) => {
          const Icon = stat.icon
          const isTrendUp = stat.trend === 'up'
          return (
            <Card key={stat.title} className="overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs font-medium text-slate-500">
                  {stat.title}
                </CardTitle>
                <div className={`rounded-lg p-2 bg-${stat.color}-50`}>
                  <Icon className={`h-4 w-4 text-${stat.color}-600`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
                <p className="flex items-center text-xs mt-1">
                  {isTrendUp ? (
                    <TrendingUp className="mr-1 h-3 w-3 text-green-600" />
                  ) : (
                    <TrendingDown className="mr-1 h-3 w-3 text-red-600" />
                  )}
                  <span className={isTrendUp ? 'text-green-600' : 'text-red-600'}>
                    {stat.change}
                  </span>
                  <span className="text-slate-500 ml-1">较上月</span>
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* 图表区域 */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* 订单趋势图 */}
        <Card>
          <CardHeader>
            <CardTitle>订单与测试趋势</CardTitle>
            <CardDescription>最近6个月的订单量和测试量对比</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{}}>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={orderData}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="orders" fill="#3b82f6" radius={[4, 4, 0, 0]} name="订单数" />
                  <Bar dataKey="tests" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="测试数" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* 配方分布图 */}
        <Card>
          <CardHeader>
            <CardTitle>配方分类分布</CardTitle>
            <CardDescription>各类型配方数量占比</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{}}>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={formulaDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {formulaDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
            <div className="flex flex-wrap gap-4 justify-center mt-4">
              {formulaDistribution.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-slate-600">{item.name}</span>
                  <span className="text-sm font-medium text-slate-900">{item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 列表区域 */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* 最近订单 */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>最近订单</CardTitle>
              <CardDescription>最新的订单状态</CardDescription>
            </div>
            <Button variant="ghost" size="sm" className="gap-1">
              查看全部
              <ArrowRight className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div
                  key={order.orderNo}
                  className="flex items-center justify-between p-3 rounded-lg border bg-white hover:bg-slate-50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-slate-900">{order.orderNo}</span>
                      {getStatusBadge(order.status)}
                    </div>
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <span>{order.customer}</span>
                      <span>{order.quantity}</span>
                      <span>{order.date}</span>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    查看
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 低库存预警 */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
                低库存预警
              </CardTitle>
              <CardDescription>需要及时补货的物料</CardDescription>
            </div>
            <Button variant="ghost" size="sm" className="gap-1">
              管理库存
              <ArrowRight className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {lowStockMaterials.map((material) => (
                <div
                  key={material.name}
                  className="flex items-center justify-between p-3 rounded-lg border bg-orange-50 border-orange-200"
                >
                  <div className="flex-1">
                    <div className="text-sm font-medium text-slate-900 mb-1">
                      {material.name}
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-orange-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-orange-500 rounded-full"
                          style={{
                            width: `${Math.min((material.stock / material.minStock) * 100, 100)}%`,
                          }}
                        />
                      </div>
                      <span className="text-xs text-slate-600">
                        {material.stock}/{material.minStock} {material.unit}
                      </span>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">
                    补货
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 快捷操作 */}
      <Card>
        <CardHeader>
          <CardTitle>快捷操作</CardTitle>
          <CardDescription>常用功能快速入口</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <Button variant="outline" className="h-auto flex-col gap-2 py-4">
              <BookOpen className="h-6 w-6" />
              <span className="text-sm font-medium">创建订单</span>
            </Button>
            <Button variant="outline" className="h-auto flex-col gap-2 py-4">
              <FlaskConical className="h-6 w-6" />
              <span className="text-sm font-medium">新建配方</span>
            </Button>
            <Button variant="outline" className="h-auto flex-col gap-2 py-4">
              <TestTube2 className="h-6 w-6" />
              <span className="text-sm font-medium">发起测试</span>
            </Button>
            <Button variant="outline" className="h-auto flex-col gap-2 py-4">
              <Package className="h-6 w-6" />
              <span className="text-sm font-medium">物料入库</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
