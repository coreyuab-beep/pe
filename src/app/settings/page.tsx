'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
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
  Settings as SettingsIcon,
  Users,
  Shield,
  Database,
  Bell,
  FileText,
  Trash2,
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

export default function SettingsPage() {
  return (
    <div className="space-y-6 p-6">
      {/* 页面标题 */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900">系统设置</h2>
        <p className="text-sm text-slate-500 mt-1">系统配置与管理</p>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">基本设置</TabsTrigger>
          <TabsTrigger value="users">用户管理</TabsTrigger>
          <TabsTrigger value="roles">权限管理</TabsTrigger>
          <TabsTrigger value="logs">操作日志</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            {/* 系统信息 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <SettingsIcon className="h-5 w-5" />
                  系统信息
                </CardTitle>
                <CardDescription>系统基本信息配置</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="systemName">系统名称</Label>
                  <Input id="systemName" defaultValue="Passive Edge 生产测试管理系统" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="systemCode">系统代码</Label>
                  <Input id="systemCode" defaultValue="PE-MMS-001" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="systemVersion">系统版本</Label>
                  <Input id="systemVersion" defaultValue="v2.1.0" disabled />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="companyName">公司名称</Label>
                  <Input id="companyName" defaultValue="Passive Edge 科技有限公司" />
                </div>
              </CardContent>
            </Card>

            {/* 通知设置 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  通知设置
                </CardTitle>
                <CardDescription>系统通知与提醒配置</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>低库存预警</Label>
                    <p className="text-xs text-slate-500">库存低于最小值时发送通知</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>订单状态变更通知</Label>
                    <p className="text-xs text-slate-500">订单状态变化时发送通知</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>测试完成通知</Label>
                    <p className="text-xs text-slate-500">测试完成后发送通知</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>系统备份通知</Label>
                    <p className="text-xs text-slate-500">数据备份完成后发送通知</p>
                  </div>
                  <Switch />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notificationEmail">通知邮箱</Label>
                  <Input id="notificationEmail" type="email" defaultValue="admin@passive-edge.com" />
                </div>
              </CardContent>
            </Card>

            {/* 数据备份 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  数据备份
                </CardTitle>
                <CardDescription>数据备份与恢复配置</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="backupInterval">备份间隔</Label>
                  <Select defaultValue="daily">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hourly">每小时</SelectItem>
                      <SelectItem value="daily">每天</SelectItem>
                      <SelectItem value="weekly">每周</SelectItem>
                      <SelectItem value="monthly">每月</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="backupRetention">保留天数</Label>
                  <Input id="backupRetention" type="number" defaultValue="30" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="backupPath">备份路径</Label>
                  <Input id="backupPath" defaultValue="/data/backup" />
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1">
                    立即备份
                  </Button>
                  <Button variant="outline" className="flex-1">
                    恢复备份
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* 业务规则 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  业务规则
                </CardTitle>
                <CardDescription>系统业务规则配置</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="minOrderQty">最小订单数量</Label>
                  <Input id="minOrderQty" type="number" defaultValue="50" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="defaultLeadTime">默认交付周期（天）</Label>
                  <Input id="defaultLeadTime" type="number" defaultValue="7" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="testTimeout">测试超时时间（小时）</Label>
                  <Input id="testTimeout" type="number" defaultValue="48" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="approvalThreshold">审批阈值</Label>
                  <Input id="approvalThreshold" type="number" defaultValue="10000" />
                  <p className="text-xs text-slate-500">订单金额超过此值需要审批</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline">
              重置
            </Button>
            <Button>
              保存设置
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                用户列表
              </CardTitle>
              <CardDescription>系统用户管理</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>用户名</TableHead>
                      <TableHead>姓名</TableHead>
                      <TableHead>邮箱</TableHead>
                      <TableHead>部门</TableHead>
                      <TableHead>角色</TableHead>
                      <TableHead>状态</TableHead>
                      <TableHead className="text-right">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">admin</TableCell>
                      <TableCell>系统管理员</TableCell>
                      <TableCell>admin@passive-edge.com</TableCell>
                      <TableCell>IT部门</TableCell>
                      <TableCell><Badge>管理员</Badge></TableCell>
                      <TableCell><Badge variant="default">活跃</Badge></TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>操作</DropdownMenuLabel>
                            <DropdownMenuItem>编辑用户</DropdownMenuItem>
                            <DropdownMenuItem>重置密码</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">禁用用户</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">zhangsan</TableCell>
                      <TableCell>张三</TableCell>
                      <TableCell>zhangsan@passive-edge.com</TableCell>
                      <TableCell>生产部</TableCell>
                      <TableCell><Badge variant="secondary">操作员</Badge></TableCell>
                      <TableCell><Badge variant="default">活跃</Badge></TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>操作</DropdownMenuLabel>
                            <DropdownMenuItem>编辑用户</DropdownMenuItem>
                            <DropdownMenuItem>重置密码</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">禁用用户</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">lisi</TableCell>
                      <TableCell>李四</TableCell>
                      <TableCell>lisi@passive-edge.com</TableCell>
                      <TableCell>质检部</TableCell>
                      <TableCell><Badge variant="secondary">操作员</Badge></TableCell>
                      <TableCell><Badge variant="default">活跃</Badge></TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>操作</DropdownMenuLabel>
                            <DropdownMenuItem>编辑用户</DropdownMenuItem>
                            <DropdownMenuItem>重置密码</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">禁用用户</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
              <div className="flex justify-end mt-4">
                <Button>
                  添加用户
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="roles" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                角色与权限
              </CardTitle>
              <CardDescription>系统角色与功能权限管理</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* 管理员角色 */}
              <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-semibold">管理员</h4>
                    <p className="text-sm text-slate-500">拥有系统所有权限</p>
                  </div>
                  <Badge>系统角色</Badge>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">订单管理</Badge>
                  <Badge variant="outline">配方管理</Badge>
                  <Badge variant="outline">物料管理</Badge>
                  <Badge variant="outline">测试管理</Badge>
                  <Badge variant="outline">用户管理</Badge>
                  <Badge variant="outline">系统设置</Badge>
                </div>
              </div>

              {/* 经理角色 */}
              <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-semibold">经理</h4>
                    <p className="text-sm text-slate-500">拥有业务管理权限</p>
                  </div>
                  <Badge variant="secondary">业务角色</Badge>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">订单管理</Badge>
                  <Badge variant="outline">配方管理</Badge>
                  <Badge variant="outline">物料管理</Badge>
                  <Badge variant="outline">测试管理</Badge>
                </div>
              </div>

              {/* 操作员角色 */}
              <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-semibold">操作员</h4>
                    <p className="text-sm text-slate-500">拥有基本操作权限</p>
                  </div>
                  <Badge variant="secondary">业务角色</Badge>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">订单查询</Badge>
                  <Badge variant="outline">配方查看</Badge>
                  <Badge variant="outline">物料出库</Badge>
                  <Badge variant="outline">测试执行</Badge>
                </div>
              </div>

              {/* 访客角色 */}
              <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-semibold">访客</h4>
                    <p className="text-sm text-slate-500">仅有查看权限</p>
                  </div>
                  <Badge variant="secondary">基础角色</Badge>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">订单查询</Badge>
                  <Badge variant="outline">配方查看</Badge>
                  <Badge variant="outline">数据统计</Badge>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline">
                  添加角色
                </Button>
                <Button>
                  保存权限
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                操作日志
              </CardTitle>
              <CardDescription>系统操作记录与审计</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>时间</TableHead>
                      <TableHead>用户</TableHead>
                      <TableHead>操作</TableHead>
                      <TableHead>模块</TableHead>
                      <TableHead>目标</TableHead>
                      <TableHead>IP地址</TableHead>
                      <TableHead>详情</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="text-sm">2024-01-15 14:30:22</TableCell>
                      <TableCell>admin</TableCell>
                      <TableCell>创建订单</TableCell>
                      <TableCell>订单管理</TableCell>
                      <TableCell>ORD-2024-001</TableCell>
                      <TableCell>192.168.1.100</TableCell>
                      <TableCell className="text-sm text-slate-500">创建新订单</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="text-sm">2024-01-15 13:45:18</TableCell>
                      <TableCell>zhangsan</TableCell>
                      <TableCell>物料入库</TableCell>
                      <TableCell>物料管理</TableCell>
                      <TableCell>MAT-001</TableCell>
                      <TableCell>192.168.1.101</TableCell>
                      <TableCell className="text-sm text-slate-500">入库 200kg</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="text-sm">2024-01-15 12:30:45</TableCell>
                      <TableCell>lisi</TableCell>
                      <TableCell>发起测试</TableCell>
                      <TableCell>配方测试</TableCell>
                      <TableCell>TEST-2024-001</TableCell>
                      <TableCell>192.168.1.102</TableCell>
                      <TableCell className="text-sm text-slate-500">开始性能测试</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="text-sm">2024-01-15 11:20:33</TableCell>
                      <TableCell>admin</TableCell>
                      <TableCell>修改配置</TableCell>
                      <TableCell>系统设置</TableCell>
                      <TableCell>-</TableCell>
                      <TableCell>192.168.1.100</TableCell>
                      <TableCell className="text-sm text-slate-500">更新通知设置</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="text-sm">2024-01-15 10:15:10</TableCell>
                      <TableCell>zhangsan</TableCell>
                      <TableCell>更新配方</TableCell>
                      <TableCell>配方管理</TableCell>
                      <TableCell>FM-001</TableCell>
                      <TableCell>192.168.1.101</TableCell>
                      <TableCell className="text-sm text-slate-500">创建新版本 v1.2</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
              <div className="flex justify-between items-center mt-4">
                <Button variant="outline" size="sm">
                  导出日志
                </Button>
                <Button variant="outline" size="sm">
                  清理日志
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
