'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { Bar, BarChart, Line, LineChart, Pie, PieChart, Cell, XAxis, YAxis, ResponsiveContainer, CartesianGrid, Legend, Tooltip } from 'recharts'

export default function StatisticsPage() {
  // 订单统计数据
  const orderStats = [
    { month: '2023-07', production: 45, test: 12, sample: 8 },
    { month: '2023-08', production: 52, test: 15, sample: 10 },
    { month: '2023-09', production: 48, test: 18, sample: 12 },
    { month: '2023-10', production: 65, test: 20, sample: 15 },
    { month: '2023-11', production: 72, test: 22, sample: 18 },
    { month: '2023-12', production: 85, test: 25, sample: 20 },
    { month: '2024-01', production: 92, test: 28, sample: 22 },
  ]

  // 配方应用统计
  const formulaApplication = [
    { name: '相变储能材料', value: 35, color: '#3b82f6' },
    { name: '热控材料', value: 28, color: '#8b5cf6' },
    { name: '保温材料', value: 22, color: '#06b6d4' },
    { name: '功能性材料', value: 15, color: '#10b981' },
  ]

  // 测试通过率统计
  const testPassRate = [
    { month: '2023-07', rate: 85 },
    { month: '2023-08', rate: 88 },
    { month: '2023-09', rate: 90 },
    { month: '2023-10', rate: 92 },
    { month: '2023-11', rate: 94 },
    { month: '2023-12', rate: 95 },
    { month: '2024-01', rate: 96 },
  ]

  // 客户订单分布
  const customerDistribution = [
    { name: '电子行业', value: 40 },
    { name: '新能源汽车', value: 30 },
    { name: '航空航天', value: 15 },
    { name: '建筑节能', value: 10 },
    { name: '其他', value: 5 },
  ]

  return (
    <div className="space-y-6 p-6">
      {/* 页面标题 */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900">数据统计</h2>
        <p className="text-sm text-slate-500 mt-1">业务数据可视化分析</p>
      </div>

      {/* 订单趋势统计 */}
      <Card>
        <CardHeader>
          <CardTitle>订单类型趋势</CardTitle>
          <CardDescription>各类订单月度统计</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={{}}>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={orderStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend />
                <Bar dataKey="production" fill="#3b82f6" name="生产订单" radius={[4, 4, 0, 0]} />
                <Bar dataKey="test" fill="#8b5cf6" name="测试订单" radius={[4, 4, 0, 0]} />
                <Bar dataKey="sample" fill="#06b6d4" name="样品订单" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {/* 配方应用分布 */}
        <Card>
          <CardHeader>
            <CardTitle>配方应用分布</CardTitle>
            <CardDescription>各类型配方使用占比</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{}}>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={formulaApplication}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {formulaApplication.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
            <div className="flex flex-wrap gap-4 justify-center mt-4">
              {formulaApplication.map((item) => (
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

        {/* 客户订单分布 */}
        <Card>
          <CardHeader>
            <CardTitle>客户行业分布</CardTitle>
            <CardDescription>各行业客户订单占比</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{}}>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={customerDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {customerDistribution.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={['#3b82f6', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b'][index]} 
                      />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
            <div className="flex flex-wrap gap-4 justify-center mt-4">
              {customerDistribution.map((item, index) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: ['#3b82f6', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b'][index] }}
                  />
                  <span className="text-sm text-slate-600">{item.name}</span>
                  <span className="text-sm font-medium text-slate-900">{item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 测试通过率趋势 */}
      <Card>
        <CardHeader>
          <CardTitle>测试通过率趋势</CardTitle>
          <CardDescription>近7个月测试合格率变化</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={{}}>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={testPassRate}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis domain={[80, 100]} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line 
                  type="monotone" 
                  dataKey="rate" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  name="通过率"
                  dot={{ fill: '#10b981', r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* 关键指标卡片 */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">
              年度订单总数
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">1,284</div>
            <p className="text-xs text-slate-500 mt-1">较去年 +12.5%</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">
              配方应用次数
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">2,456</div>
            <p className="text-xs text-slate-500 mt-1">较去年 +8.3%</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">
              完成测试数
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">892</div>
            <p className="text-xs text-slate-500 mt-1">合格率 96.2%</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">
              客户总数
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">156</div>
            <p className="text-xs text-slate-500 mt-1">较去年 +15.8%</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
