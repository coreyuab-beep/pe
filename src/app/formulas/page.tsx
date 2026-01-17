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
  Eye,
  Edit,
  MoreHorizontal,
  GitBranch,
  Thermometer,
  Zap,
  Activity,
  Layers,
  CheckCircle2
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

export default function FormulasPage() {
  const [searchKeyword, setSearchKeyword] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [selectedFormula, setSelectedFormula] = useState<string | null>(null)

  // 模拟配方数据
  const formulas = [
    {
      id: 'FM-001',
      code: 'PCM-HE-001',
      name: '高储能相变材料-001',
      version: 'v1.2',
      category: '相变储能材料',
      description: '适用于新能源电池热管理的高性能相变材料',
      phaseChangeTemperature: 45,
      latentHeat: 220,
      thermalConductivity: 2.5,
      stability: 5000,
      status: 'published',
      materials: 5,
      createdAt: '2024-01-10',
    },
    {
      id: 'FM-002',
      code: 'PCM-TC-002',
      name: '热控复合材料-002',
      version: 'v2.1',
      category: '热控材料',
      description: '航天电子设备热控专用材料',
      phaseChangeTemperature: 35,
      latentHeat: 180,
      thermalConductivity: 3.2,
      stability: 8000,
      status: 'published',
      materials: 8,
      createdAt: '2024-01-08',
    },
    {
      id: 'FM-003',
      code: 'PCM-TE-003',
      name: '保温节能材料-003',
      version: 'v1.0',
      category: '保温材料',
      description: '建筑节能保温用相变材料',
      phaseChangeTemperature: 25,
      latentHeat: 150,
      thermalConductivity: 0.8,
      stability: 3000,
      status: 'draft',
      materials: 4,
      createdAt: '2024-01-05',
    },
    {
      id: 'FM-004',
      code: 'PCM-SA-004',
      name: '功能性相变材料-004',
      version: 'v1.5',
      category: '功能性材料',
      description: '具有抗菌功能的相变材料',
      phaseChangeTemperature: 38,
      latentHeat: 165,
      thermalConductivity: 1.8,
      stability: 4000,
      status: 'published',
      materials: 6,
      createdAt: '2024-01-03',
    },
    {
      id: 'FM-005',
      code: 'PCM-HE-005',
      name: '高储能相变材料-005',
      version: 'v1.0',
      category: '相变储能材料',
      description: '低温储能相变材料',
      phaseChangeTemperature: 18,
      latentHeat: 195,
      thermalConductivity: 2.1,
      stability: 6000,
      status: 'published',
      materials: 5,
      createdAt: '2023-12-28',
    },
  ]

  const versions = [
    { version: 'v2.1', date: '2024-01-15', description: '优化导热系数，提升散热性能', status: 'current' },
    { version: 'v2.0', date: '2024-01-10', description: '调整配方比例', status: 'previous' },
    { version: 'v1.2', date: '2024-01-05', description: '初始版本发布', status: 'previous' },
    { version: 'v1.1', date: '2023-12-20', description: '测试版本', status: 'previous' },
    { version: 'v1.0', date: '2023-12-15', description: '首次创建', status: 'previous' },
  ]

  const formulaMaterials = [
    { name: '石蜡基材料', ratio: 35, unit: '%' },
    { name: '石墨烯', ratio: 15, unit: '%' },
    { name: '氮化硼', ratio: 20, unit: '%' },
    { name: '膨胀石墨', ratio: 25, unit: '%' },
    { name: '功能性添加剂', ratio: 5, unit: '%' },
  ]

  const getCategoryBadge = (category: string) => {
    const colors = {
      '相变储能材料': 'blue',
      '热控材料': 'purple',
      '保温材料': 'cyan',
      '功能性材料': 'green',
    }
    const color = colors[category as keyof typeof colors] || 'gray'
    return <Badge variant="outline" className={`border-${color}-500 text-${color}-700`}>{category}</Badge>
  }

  const getStatusBadge = (status: string) => {
    const config = {
      published: { label: '已发布', variant: 'default' as const, icon: CheckCircle2 },
      draft: { label: '草稿', variant: 'secondary' as const, icon: Edit },
    }
    const configItem = config[status as keyof typeof config] || config.draft
    const Icon = configItem.icon
    return (
      <Badge variant={configItem.variant} className="gap-1">
        <Icon className="h-3 w-3" />
        {configItem.label}
      </Badge>
    )
  }

  const VersionHistory = () => (
    <div className="space-y-4">
      {versions.map((version, index) => (
        <div key={version.version} className="relative">
          {index !== versions.length - 1 && (
            <div className="absolute left-3 top-8 h-full w-0.5 bg-slate-200" />
          )}
          <div className="flex gap-4">
            <div className={`flex h-6 w-6 items-center justify-center rounded-full border-2 ${
              version.status === 'current' 
                ? 'border-blue-500 bg-blue-500 text-white' 
                : 'border-slate-300 bg-white'
            }`}>
              {version.status === 'current' ? (
                <GitBranch className="h-3 w-3" />
              ) : (
                <div className="h-2 w-2 rounded-full bg-slate-300" />
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-900">{version.version}</span>
                {version.status === 'current' && (
                  <Badge variant="default" className="text-xs">当前版本</Badge>
                )}
              </div>
              <p className="text-sm text-slate-600 mt-1">{version.description}</p>
              <p className="text-xs text-slate-500 mt-1">{version.date}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )

  const FormulaDetails = () => (
    <div className="space-y-6">
      {/* 基本信息 */}
      <div>
        <h3 className="text-lg font-semibold text-slate-900 mb-3">基本信息</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-sm text-slate-500">配方代码</label>
            <p className="font-medium text-slate-900">PCM-HE-001</p>
          </div>
          <div className="space-y-1">
            <label className="text-sm text-slate-500">配方名称</label>
            <p className="font-medium text-slate-900">高储能相变材料-001</p>
          </div>
          <div className="space-y-1">
            <label className="text-sm text-slate-500">当前版本</label>
            <p className="font-medium text-slate-900">v1.2</p>
          </div>
          <div className="space-y-1">
            <label className="text-sm text-slate-500">分类</label>
            <p className="font-medium text-slate-900">相变储能材料</p>
          </div>
        </div>
      </div>

      {/* 性能参数 */}
      <div>
        <h3 className="text-lg font-semibold text-slate-900 mb-3">性能参数</h3>
        <div className="grid gap-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="flex items-center gap-2 text-slate-600">
                <Thermometer className="h-4 w-4" />
                相变温度
              </span>
              <span className="font-medium text-slate-900">45°C</span>
            </div>
            <Progress value={45} max={100} className="h-2" />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="flex items-center gap-2 text-slate-600">
                <Zap className="h-4 w-4" />
                潜热
              </span>
              <span className="font-medium text-slate-900">220 J/g</span>
            </div>
            <Progress value={88} max={100} className="h-2" />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="flex items-center gap-2 text-slate-600">
                <Activity className="h-4 w-4" />
                导热系数
              </span>
              <span className="font-medium text-slate-900">2.5 W/(m·K)</span>
            </div>
            <Progress value={62} max={100} className="h-2" />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="flex items-center gap-2 text-slate-600">
                <Layers className="h-4 w-4" />
                循环稳定性
              </span>
              <span className="font-medium text-slate-900">5000 次</span>
            </div>
            <Progress value={71} max={100} className="h-2" />
          </div>
        </div>
      </div>

      {/* 材料组成 */}
      <div>
        <h3 className="text-lg font-semibold text-slate-900 mb-3">材料组成</h3>
        <div className="space-y-2">
          {formulaMaterials.map((material) => (
            <div key={material.name} className="flex items-center justify-between p-3 rounded-lg border bg-slate-50">
              <span className="text-sm text-slate-700">{material.name}</span>
              <span className="text-sm font-medium text-slate-900">{material.ratio}{material.unit}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <div className="space-y-6 p-6">
      {/* 页面标题和操作 */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">配方管理</h2>
          <p className="text-sm text-slate-500 mt-1">相变材料配方库与版本控制</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <GitBranch className="h-4 w-4" />
            版本历史
          </Button>
          <Button size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            新建配方
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
                  placeholder="搜索配方代码、名称..."
                  className="pl-10"
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[140px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="配方分类" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部分类</SelectItem>
                  <SelectItem value="phase_change">相变储能材料</SelectItem>
                  <SelectItem value="thermal_control">热控材料</SelectItem>
                  <SelectItem value="insulation">保温材料</SelectItem>
                  <SelectItem value="functional">功能性材料</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="list" className="space-y-4">
        <TabsList>
          <TabsTrigger value="list">配方列表</TabsTrigger>
          <TabsTrigger value="versions">版本管理</TabsTrigger>
          <TabsTrigger value="details">配方详情</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>配方库</CardTitle>
              <CardDescription>共 {formulas.length} 个配方</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>配方代码</TableHead>
                      <TableHead>配方名称</TableHead>
                      <TableHead>分类</TableHead>
                      <TableHead>版本</TableHead>
                      <TableHead>相变温度</TableHead>
                      <TableHead>潜热</TableHead>
                      <TableHead>导热系数</TableHead>
                      <TableHead>稳定性</TableHead>
                      <TableHead>材料数</TableHead>
                      <TableHead>状态</TableHead>
                      <TableHead className="text-right">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {formulas.map((formula) => (
                      <TableRow 
                        key={formula.id} 
                        className="cursor-pointer hover:bg-slate-50"
                        onClick={() => setSelectedFormula(formula.id)}
                      >
                        <TableCell className="font-medium">{formula.code}</TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium text-slate-900">{formula.name}</div>
                            <div className="text-xs text-slate-500">{formula.description}</div>
                          </div>
                        </TableCell>
                        <TableCell>{getCategoryBadge(formula.category)}</TableCell>
                        <TableCell>{formula.version}</TableCell>
                        <TableCell>{formula.phaseChangeTemperature}°C</TableCell>
                        <TableCell>{formula.latentHeat} J/g</TableCell>
                        <TableCell>{formula.thermalConductivity} W/(m·K)</TableCell>
                        <TableCell>{formula.stability} 次</TableCell>
                        <TableCell>{formula.materials}</TableCell>
                        <TableCell>{getStatusBadge(formula.status)}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
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
                                编辑配方
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <GitBranch className="mr-2 h-4 w-4" />
                                创建新版本
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

        <TabsContent value="versions" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GitBranch className="h-5 w-5" />
                  版本历史
                </CardTitle>
                <CardDescription>PCM-HE-001 配方版本记录</CardDescription>
              </CardHeader>
              <CardContent>
                <VersionHistory />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>版本对比</CardTitle>
                <CardDescription>对比不同版本的参数变化</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 rounded-lg border bg-blue-50">
                    <div className="font-medium text-blue-900">v2.1 (当前)</div>
                    <div className="text-sm text-blue-700 mt-1">优化导热系数，提升散热性能</div>
                  </div>
                  <div className="p-4 rounded-lg border bg-slate-50">
                    <div className="font-medium text-slate-900">v2.0</div>
                    <div className="text-sm text-slate-600 mt-1">调整配方比例</div>
                  </div>
                  <Button variant="outline" className="w-full">
                    查看详细对比
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="details" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>配方详情</CardTitle>
              <CardDescription>PCM-HE-001 v1.2 完整配方信息</CardDescription>
            </CardHeader>
            <CardContent>
              <FormulaDetails />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
