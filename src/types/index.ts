// 订单状态枚举
export enum OrderStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

// 订单优先级
export enum OrderPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent'
}

// 订单类型
export type OrderType = 'production' | 'test' | 'sample'

// 订单接口
export interface Order {
  id: string
  orderNo: string
  customerId: string
  customerName: string
  contactPerson: string
  contactPhone: string
  contactEmail: string
  type: OrderType
  status: OrderStatus
  priority: OrderPriority
  formulaId: string
  formulaVersion: string
  quantity: number
  unit: string
  deliveryDate: string
  orderDate: string
  totalAmount: number
  remarks: string
  createdAt: string
  updatedAt: string
  createdBy: string
  materials?: Material[]
  tests?: TestRecord[]
}

// 配方接口
export interface Formula {
  id: string
  code: string
  name: string
  version: string
  description: string
  phaseChangeTemperature: number // 相变温度 (°C)
  latentHeat: number // 潜热 (J/g)
  thermalConductivity: number // 导热系数 (W/(m·K))
  density: number // 密度 (g/cm³)
  specificHeat: number // 比热容 (J/(kg·K))
  meltingPoint: number // 熔点 (°C)
  solidificationPoint: number // 凝固点 (°C)
  stability: number // 循环稳定性 (次)
  category: string // 分类
  materials: FormulaMaterial[]
  parameters: Record<string, any>
  standardReference: string // 参考标准
  createdAt: string
  updatedAt: string
  createdBy: string
  isPublished: boolean
}

// 配方材料关联
export interface FormulaMaterial {
  materialId: string
  materialName: string
  ratio: number // 比例 (%)
  requiredQuantity: number
}

// 物料状态
export enum MaterialStatus {
  NORMAL = 'normal',
  LOW_STOCK = 'low_stock',
  OUT_OF_STOCK = 'out_of_stock',
  EXPIRED = 'expired'
}

// 物料接口
export interface Material {
  id: string
  code: string
  name: string
  category: string
  specification: string
  unit: string
  currentStock: number
  minStock: number
  maxStock: number
  supplierId: string
  supplierName: string
  batchNo: string
  productionDate: string
  expiryDate: string
  status: MaterialStatus
  price: number
  createdAt: string
  updatedAt: string
  createdBy: string
}

// 出入库类型
export enum StockOperationType {
  IN = 'in',
  OUT = 'out',
  ADJUST = 'adjust'
}

// 出入库记录
export interface StockOperation {
  id: string
  materialId: string
  materialName: string
  type: StockOperationType
  quantity: number
  beforeStock: number
  afterStock: number
  batchNo: string
  reason: string
  referenceNo?: string // 关联订单号或测试编号
  approvedBy: string
  createdAt: string
  createdBy: string
}

// 供应商接口
export interface Supplier {
  id: string
  name: string
  code: string
  contactPerson: string
  phone: string
  email: string
  address: string
  rating: number
  status: 'active' | 'inactive'
  createdAt: string
  updatedAt: string
}

// 测试状态
export enum TestStatus {
  PENDING = 'pending',
  TESTING = 'testing',
  COMPLETED = 'completed',
  FAILED = 'failed'
}

// 测试记录接口
export interface TestRecord {
  id: string
  testNo: string
  formulaId: string
  formulaName: string
  formulaVersion: string
  orderId?: string
  orderNo?: string
  testType: string
  status: TestStatus
  testStandard: string
  tester: string
  startDate: string
  endDate?: string
  results: TestResult[]
  conclusion: string
  attachments?: string[]
  createdAt: string
  updatedAt: string
  createdBy: string
}

// 测试结果数据
export interface TestResult {
  parameterName: string
  parameterValue: number
  unit: string
  standardValue: number
  tolerance: number
  isQualified: boolean
  testTime: string
  chartData?: ChartDataPoint[]
}

// 图表数据点
export interface ChartDataPoint {
  time: string
  temperature: number
  value: number
}

// 测试标准模板
export interface TestStandard {
  id: string
  name: string
  code: string
  description: string
  parameters: TestParameter[]
  createdAt: string
  updatedAt: string
}

// 测试参数
export interface TestParameter {
  name: string
  unit: string
  minValue: number
  maxValue: number
  standardValue: number
  tolerance: number
  testMethod: string
}

// 用户角色
export enum UserRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
  OPERATOR = 'operator',
  VIEWER = 'viewer'
}

// 用户接口
export interface User {
  id: string
  username: string
  name: string
  email: string
  phone: string
  role: UserRole
  department: string
  avatar?: string
  status: 'active' | 'inactive'
  createdAt: string
  updatedAt: string
}

// 操作日志
export interface OperationLog {
  id: string
  userId: string
  userName: string
  action: string
  module: string
  targetId: string
  targetName: string
  details: string
  ip: string
  createdAt: string
}

// 仪表盘统计数据
export interface DashboardStats {
  totalOrders: number
  pendingOrders: number
  processingOrders: number
  completedOrders: number
  totalFormulas: number
  activeFormulas: number
  lowStockMaterials: number
  totalTests: number
  completedTests: number
  pendingTests: number
  monthlyOrders: ChartDataPoint[]
  monthlyTests: ChartDataPoint[]
  formulaDistribution: { name: string; value: number; color: string }[]
  stockStatus: { status: string; count: number; color: string }[]
}

// 分页参数
export interface PaginationParams {
  page: number
  pageSize: number
  total?: number
}

// 查询参数
export interface QueryParams extends PaginationParams {
  keyword?: string
  status?: string
  startDate?: string
  endDate?: string
  [key: string]: any
}
