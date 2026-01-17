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
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
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
  Eye,
  Play,
  FileText,
  CheckCircle2,
  Clock,
  XCircle,
  TrendingUp,
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
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Legend } from 'recharts'

export default function TestsPage() {
  const [searchKeyword, setSearchKeyword] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  // 模拟测试记录
  const tests = [
    {
      id: 'TEST-2024-001',
      testNo: 'T202401001',
      formulaName: 'PCM-HE-001 高储能相变材料',
      formulaVersion: 'v1.2',
      orderId: 'ORD-2024-001',
      orderNo: 'ORD-2024-001',
      testType: '性能测试',
      status: 'completed',
      testStandard: 'GB/T 25100-2010',
      tester: '李工程师',
      startDate: '2024-01-15 09:00',
      endDate: '2024-01-15 16:30',
      conclusion: '测试合格，各项指标符合标准要求',
      resultCount: 5,
      passCount: 5,
    },
    {
      id: 'TEST-2024-002',
      testNo: 'T202401002',
      formulaName: 'PCM-TC-002 热控复合材料',
      formulaVersion: 'v2.1',
      orderId: 'ORD-2024-002',
      orderNo: 'ORD-2024-002',
      testType: '热性能测试',
      status: 'testing',
      testStandard: 'ASTM D7984-21',
      tester: '王工程师',
      startDate: '2024-01-16 08:30',
      endDate: null,
      conclusion: null,
      resultCount: 4,
      passCount: 2,
    },
    {
      id: 'TEST-2024-003',
      testNo: 'T202401003',
      formulaName: 'PCM-TE-003 保温节能材料',
      formulaVersion: 'v1.0',
      orderId: null,
      orderNo: null,
      testType: '稳定性测试',
      status: 'pending',
      testStandard: 'ISO 11501:1995',
      tester: '张工程师',
      startDate: null,
      endDate: null,
      conclusion: null,
      resultCount: 3,
      passCount: 0,
    },
    {
      id: 'TEST-2024-004',
      testNo: 'T202401004',
      formulaName: 'PCM-SA-004 功能性相变材料',
      formulaVersion: 'v1.5',
      orderId: 'ORD-2024-004',
      orderNo: 'ORD-2024-004',
      testType: '抗菌性能测试',
      status: 'completed',
      testStandard: 'GB/T 31402-2015',
      tester: '刘工程师',
      startDate: '2024-01-14 10:00',
      endDate: '2024-01-14 18:00',
      conclusion: '测试合格，抗菌率达到99.9%',
      resultCount: 4,
      passCount: 4,
    },
    {
      id: 'TEST-2024-005',
      testNo: 'T202401005',
      formulaName: 'PCM-HE-005 高储能相变材料',
      formulaVersion: 'v1.0',
      orderId: null,
      orderNo: null,
      testType: '循环稳定性测试',
      status: 'failed',
      testStandard: 'IEC 62217:2004',
      tester: '陈工程师',
      startDate: '2024-01-13 14:00',
      endDate: '2024-01-14 10:00',
      conclusion: '测试不合格，循环稳定性未达标',
      resultCount: 3,
      passCount: 1,
    },
  ]

  // 模拟测试数据
  const testData = [
    { time: '00:00', temperature: 20, standard: 20 },
    { time: '01:00', temperature: 25, standard: 25 },
    { time: '02:00', temperature: 30, standard: 30 },
    { time: '03:00', temperature: 35, standard: 35 },
    { time: '04:00', temperature: 40, standard: 40 },
    { time: '05:00', temperature: 45, standard: 45 },
    { time: '06:00', temperature: 50, standard: 50 },
    { time: '07:00', temperature: 45, standard: 45 },
    { time: '08:00', temperature: 40, standard: 40 },
    { time: '09:00', temperature: 35, standard: 35 },
    { time: '10:00', temperature: 30, standard: 30 },
    { time: '11:00', temperature: 25, standard: 25 },
    { time: '12:00', temperature: 20, standard: 20 },
  ]

  const testResults = [
    {
      parameterName: '相变温度',
      parameterValue: 45.2,
      unit: '°C',
      standardValue: 45,
      tolerance: 2,
      isQualified: true,
      testTime: '2024-01-15 10:30',
    },
    {
      parameterName: '潜热',
      parameterValue: 218.5,
      unit: 'J/g',
      standardValue: 220,
      tolerance: 10,
      isQualified: true,
      testTime: '2024-01-15 11:45',
    },
    {
      parameterName: '导热系数',
      parameterValue: 2.6,
      unit: 'W/(m·K)',
      standardValue: 2.5,
      tolerance: 0.5,
      isQualified: true,
      testTime: '2024-01-15 12:30',
    },
    {
      parameterName: '熔点',
      parameterValue: 46.5,
      unit: '°C',
      standardValue: 45,
      tolerance: 2,
      isQualified: true,
      testTime: '2024-01-15 13:15',
    },
    {
      parameterName: '凝固点',
      parameterValue: 43.8,
      unit: '°C',
      standardValue: 45,
      tolerance: 2,
      isQualified: true,
      testTime: '2024-01-15 14:00',
    },
  ]

  const getStatusBadge = (status: string) => {
    const config = {
      pending: { label: '待测试', variant: 'secondary' as const, icon: Clock },
      testing: { label: '测试中', variant: 'default' as const, icon: Play },
      completed: { label: '已完成', variant: 'outline' as const, icon: CheckCircle2 },
      failed: { label: '测试失败', variant: 'destructive' as const, icon: XCircle },
    }
    const configItem = config[status as keyof typeof config] || config.pending
    const Icon = configItem.icon
    return (
      <Badge variant={configItem.variant} className="gap-1">
        <Icon className="h-3 w-3" />
        {configItem.label}
      </Badge>
    )
  }

  const TestChart = () => (
    <ChartContainer config={{}}>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={testData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="temperature" 
            stroke="#3b82f6" 
            strokeWidth={2}
            name="实测温度"
            dot={{ fill: '#3b82f6' }}
          />
          <Line 
            type="monotone" 
            dataKey="standard" 
            stroke="#94a3b8" 
            strokeWidth={2}
            strokeDasharray="5 5"
            name="标准温度"
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  )

  const TestResultsTable = () => (
    <div className="space-y-3">
      {testResults.map((result, index) => (
        <div key={index} className="flex items-center justify-between p-4 rounded-lg border bg-white">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-medium text-slate-900">{result.parameterName}</span>
              {result.isQualified ? (
                <Badge variant="outline" className="text-green-600 border-green-600">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  合格
                </Badge>
              ) : (
                <Badge variant="destructive">
                  <XCircle className="h-3 w-3 mr-1" />
                  不合格
                </Badge>
              )}
            </div>
            <div className="flex gap-6 text-sm text-slate-600">
              <span>实测值: <span className="font-medium text-slate-900">{result.parameterValue} {result.unit}</span></span>
              <span>标准值: <span className="font-medium text-slate-900">{result.standardValue} {result.unit}</span></span>
              <span>允许偏差: ±{result.tolerance} {result.unit}</span>
            </div>
          </div>
          <div className="text-xs text-slate-500">
            {result.testTime}
          </div>
        </div>
      ))}
    </div>
  )

  const testStats = {
    totalTests: tests.length,
    completedTests: tests.filter(t => t.status === 'completed').length,
    testingTests: tests.filter(t => t.status === 'testing').length,
    pendingTests: tests.filter(t => t.status === 'pending').length,
    failedTests: tests.filter(t => t.status === 'failed').length,
    passRate: Math.round(
      (tests.filter(t => t.status === 'completed' && t.passCount === t.resultCount).length / 
       tests.filter(t => t.status === 'completed').length) * 100
    ),
  }

  return (
    <div className="space-y-6 p-6">
      {/* 页面标题和操作 */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">配方测试</h2>
          <p className="text-sm text-slate-500 mt-1">测试记录管理与数据可视化分析</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="h-4 w-4" />
            导出报告
          </Button>
          <Button size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            发起测试
          </Button>
        </div>
      </div>

      {/* 测试统计卡片 */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">
              总测试数
            </CardTitle>
            <FileText className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{testStats.totalTests}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">
              已完成
            </CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{testStats.completedTests}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">
              测试中
            </CardTitle>
            <Play className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{testStats.testingTests}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">
              待测试
            </CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{testStats.pendingTests}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">
              合格率
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{testStats.passRate}%</div>
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
                  placeholder="搜索测试编号、配方名称、订单号..."
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
                  <SelectValue placeholder="测试状态" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部状态</SelectItem>
                  <SelectItem value="pending">待测试</SelectItem>
                  <SelectItem value="testing">测试中</SelectItem>
                  <SelectItem value="completed">已完成</SelectItem>
                  <SelectItem value="failed">测试失败</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 标签页 */}
      <Tabs defaultValue="list" className="space-y-4">
        <TabsList>
          <TabsTrigger value="list">测试记录</TabsTrigger>
          <TabsTrigger value="details">测试详情</TabsTrigger>
          <TabsTrigger value="report">测试报告</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>测试列表</CardTitle>
              <CardDescription>共 {tests.length} 条测试记录</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>测试编号</TableHead>
                      <TableHead>配方名称</TableHead>
                      <TableHead>版本</TableHead>
                      <TableHead>关联订单</TableHead>
                      <TableHead>测试类型</TableHead>
                      <TableHead>测试标准</TableHead>
                      <TableHead>测试工程师</TableHead>
                      <TableHead>状态</TableHead>
                      <TableHead>开始时间</TableHead>
                      <TableHead>完成时间</TableHead>
                      <TableHead>结果</TableHead>
                      <TableHead className="text-right">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tests.map((test) => (
                      <TableRow key={test.id}>
                        <TableCell className="font-medium">{test.testNo}</TableCell>
                        <TableCell>{test.formulaName}</TableCell>
                        <TableCell>{test.formulaVersion}</TableCell>
                        <TableCell>{test.orderNo || '-'}</TableCell>
                        <TableCell>{test.testType}</TableCell>
                        <TableCell>{test.testStandard}</TableCell>
                        <TableCell>{test.tester}</TableCell>
                        <TableCell>{getStatusBadge(test.status)}</TableCell>
                        <TableCell>{test.startDate || '-'}</TableCell>
                        <TableCell>{test.endDate || '-'}</TableCell>
                        <TableCell>
                          {test.status === 'completed' && (
                            <Badge variant={test.passCount === test.resultCount ? 'default' : 'destructive'}>
                              {test.passCount}/{test.resultCount} 合格
                            </Badge>
                          )}
                          {test.status !== 'completed' && '-'}
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
                                <FileText className="mr-2 h-4 w-4" />
                                生成报告
                              </DropdownMenuItem>
                              {test.status === 'pending' && (
                                <DropdownMenuItem>
                                  <Play className="mr-2 h-4 w-4" />
                                  开始测试
                                </DropdownMenuItem>
                              )}
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

        <TabsContent value="details" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>温度变化曲线</CardTitle>
                <CardDescription>PCM-HE-001 相变温度测试</CardDescription>
              </CardHeader>
              <CardContent>
                <TestChart />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>测试结果</CardTitle>
                <CardDescription>各参数测试值与标准值对比</CardDescription>
              </CardHeader>
              <CardContent>
                <TestResultsTable />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="report" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>测试报告预览</CardTitle>
              <CardDescription>TEST-2024-001 完整测试报告</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">测试基本信息</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-slate-500">测试编号：</span>
                      <span className="font-medium">T202401001</span>
                    </div>
                    <div>
                      <span className="text-slate-500">配方名称：</span>
                      <span className="font-medium">PCM-HE-001</span>
                    </div>
                    <div>
                      <span className="text-slate-500">配方版本：</span>
                      <span className="font-medium">v1.2</span>
                    </div>
                    <div>
                      <span className="text-slate-500">测试标准：</span>
                      <span className="font-medium">GB/T 25100-2010</span>
                    </div>
                    <div>
                      <span className="text-slate-500">测试工程师：</span>
                      <span className="font-medium">李工程师</span>
                    </div>
                    <div>
                      <span className="text-slate-500">测试时间：</span>
                      <span className="font-medium">2024-01-15 09:00 - 16:30</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">测试结论</h3>
                  <div className="p-4 rounded-lg bg-green-50 border border-green-200">
                    <p className="text-green-900">测试合格，各项指标符合标准要求</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">测试结果汇总</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>参数名称</TableHead>
                        <TableHead>实测值</TableHead>
                        <TableHead>标准值</TableHead>
                        <TableHead>判定</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {testResults.map((result, index) => (
                        <TableRow key={index}>
                          <TableCell>{result.parameterName}</TableCell>
                          <TableCell>{result.parameterValue} {result.unit}</TableCell>
                          <TableCell>{result.standardValue} {result.unit}</TableCell>
                          <TableCell>
                            {result.isQualified ? (
                              <CheckCircle2 className="h-5 w-5 text-green-600" />
                            ) : (
                              <XCircle className="h-5 w-5 text-red-600" />
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline">
                  打印报告
                </Button>
                <Button>
                  下载PDF
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
