# 业务逻辑联动使用指南

本指南说明了系统中各功能模块之间的业务逻辑联动。

## 系统架构

```
┌─────────────┐
│   订单管理   │────┐
└─────────────┘    │
                   │
┌─────────────┐    │    ┌─────────────┐
│   配方管理   │────┼───→│   物料管理   │
└─────────────┘    │    └─────────────┘
                   │
┌─────────────┐    │
│   测试管理   │────┘
└─────────────┘
```

## 核心业务流程

### 1. 订单创建流程

#### 步骤 1: 创建订单

**API**: `POST /api/orders`

```json
{
  "orderNo": "PE-20250117-J001",
  "customerName": "测试客户",
  "contactPerson": "张三",
  "contactPhone": "13800138000",
  "type": "production",
  "status": "pending",
  "priority": "medium",
  "formulaId": "formula-id",
  "formulaVersion": "1.0",
  "quantity": 100,
  "unit": "kg",
  "deliveryDate": "2025-02-01",
  "createdBy": "admin"
}
```

**联动逻辑**:
1. 系统自动检查配方所需物料的库存
2. 返回物料需求和库存警告
3. 标记库存不足的物料

**响应示例**:
```json
{
  "success": true,
  "data": {
    "id": "order-id",
    "orderNo": "PE-20250117-J001",
    "status": "pending",
    ...
  },
  "materialRequirements": [
    {
      "materialCode": "P01",
      "materialName": "石蜡 PCM-01",
      "requiredQuantity": 90,
      "currentStock": 1000,
      "isSufficient": true
    },
    {
      "materialCode": "A01",
      "materialName": "成核剂",
      "requiredQuantity": 10,
      "currentStock": 300,
      "isSufficient": true
    }
  ],
  "warnings": [
    "物料 A01 领料后将低于最小库存 (领料后: 290, 最小: 300)"
  ]
}
```

#### 步骤 2: 查看订单详情

**API**: `GET /api/orders/{id}`

返回订单信息和物料需求清单。

### 2. 订单生产流程

#### 步骤 1: 开始生产（更新订单状态）

**API**: `PATCH /api/orders/{id}`

```json
{
  "status": "processing"
}
```

**请求头**:
```
x-approved-by: admin
```

**联动逻辑**:
1. 更新订单状态为"生产中"
2. 自动创建出库记录
3. 扣减物料库存
4. 更新物料状态（正常/低库存/缺货）
5. 记录库存操作日志

**返回**:
```json
{
  "success": true,
  "message": "订单状态更新成功，物料库存扣减成功"
}
```

#### 步骤 2: 创建测试记录

**API**: `POST /api/tests`

```json
{
  "testNo": "T-20250117-ABC",
  "formulaId": "formula-id",
  "formulaName": "PCM-25 标准配方",
  "formulaVersion": "1.0",
  "orderId": "order-id",
  "orderNo": "PE-20250117-J001",
  "testType": "性能测试",
  "status": "pending",
  "tester": "李四",
  "createdBy": "admin"
}
```

#### 步骤 3: 完成测试

**API**: `PATCH /api/tests/{id}`

```json
{
  "status": "completed",
  "conclusion": "测试通过，各项指标符合要求"
}
```

**联动逻辑**:
1. 更新测试状态为"已完成"
2. 如果测试关联了订单，自动将订单状态更新为"已完成"
3. 更新订单的发货日期

#### 步骤 4: 完成订单

订单状态会自动更新为"已完成"，准备发货。

### 3. 库存管理流程

#### 物料入库

**API**: `POST /api/materials/{id}/stock`

```json
{
  "quantity": 500,
  "operation": "in",
  "reason": "采购入库",
  "referenceNo": "PO-20250117-001",
  "approvedBy": "admin",
  "createdBy": "admin"
}
```

**联动逻辑**:
1. 增加物料库存
2. 更新物料状态
3. 记录入库操作

#### 物料出库

**API**: `POST /api/materials/{id}/stock`

```json
{
  "quantity": 100,
  "operation": "out",
  "reason": "生产领料",
  "referenceNo": "PE-20250117-J001",
  "approvedBy": "admin",
  "createdBy": "admin"
}
```

**联动逻辑**:
1. 检查库存是否充足
2. 扣减物料库存
3. 更新物料状态
4. 记录出库操作

#### 库存预警

系统会自动识别低库存物料：
- 当前库存 < 最小库存 → 状态为"低库存"
- 当前库存 = 0 → 状态为"缺货"

### 4. 配方管理流程

#### 创建配方

**API**: `POST /api/formulas`

```json
{
  "code": "F-003",
  "name": "PCM-35 高性能配方",
  "version": "1.0",
  "description": "熔点 35°C 的高性能相变材料",
  "phaseChangeTemperature": 35.0,
  "latentHeat": 220.5,
  "thermalConductivity": 1.5,
  "isPublished": true,
  "createdBy": "admin"
}
```

#### 添加配方材料

需要创建配方材料关联记录。

### 5. 数据统计

**API**: `GET /api/dashboard/stats`

返回：
- 订单统计（总数、待处理、生产中、已完成、已取消）
- 配方统计（总数、已发布、草稿）
- 物料统计（总数、正常、低库存、缺货）
- 测试统计（总数、待测试、测试中、已完成、失败）
- 低库存物料列表
- 待处理订单列表
- 待测试记录列表

## 初始化数据

首次部署后，需要初始化示例数据：

**API**: `POST /api/init`

这会创建：
- 默认管理员账号（admin / admin123）
- 示例供应商
- 示例物料（包含不同分类）
- 示例配方
- 配方材料关联

## 业务规则

### 订单状态流转

```
待处理 (pending)
    ↓
生产中 (processing)
    ↓
已完成 (completed)

待处理 (pending)
    ↓
已取消 (cancelled)
```

### 库存检查规则

1. **订单创建时**: 检查配方所需物料库存是否充足
2. **订单生产时**: 自动扣减物料库存
3. **库存不足**: 订单创建时显示警告，但允许创建
4. **库存预警**: 库存低于最小值时，物料状态自动变为"低库存"

### 测试与订单联动

1. 测试完成且关联订单 → 自动更新订单状态为"已完成"
2. 测试失败 → 订单状态保持"生产中"，等待重新测试

### 物料状态规则

- `currentStock > minStock` → `status = "normal"`
- `0 < currentStock <= minStock` → `status = "low_stock"`
- `currentStock = 0` → `status = "out_of_stock"`

## API 端点汇总

| 端点 | 方法 | 说明 |
|------|------|------|
| `/api/orders` | GET | 获取订单列表 |
| `/api/orders` | POST | 创建订单（含库存检查） |
| `/api/orders/{id}` | GET | 获取订单详情 |
| `/api/orders/{id}` | PATCH | 更新订单（含状态联动） |
| `/api/orders/{id}` | DELETE | 删除订单 |
| `/api/materials` | GET | 获取物料列表 |
| `/api/materials` | POST | 创建物料 |
| `/api/materials/{id}/stock` | POST | 更新物料库存 |
| `/api/formulas` | GET | 获取配方列表 |
| `/api/formulas` | POST | 创建配方 |
| `/api/tests` | GET | 获取测试记录列表 |
| `/api/tests` | POST | 创建测试记录 |
| `/api/tests/{id}` | PATCH | 更新测试记录（含订单联动） |
| `/api/dashboard/stats` | GET | 获取仪表盘统计 |
| `/api/init` | POST | 初始化数据库数据 |

## 使用示例

### 完整的订单生产流程

```bash
# 1. 初始化数据
curl -X POST https://your-domain.vercel.app/api/init

# 2. 创建订单
curl -X POST https://your-domain.vercel.app/api/orders \
  -H "Content-Type: application/json" \
  -H "x-creator-code: J" \
  -d '{
    "orderNo": "PE-20250117-J001",
    "customerName": "测试客户",
    "contactPerson": "张三",
    "type": "production",
    "quantity": 100,
    "unit": "kg",
    "formulaId": "formula-id",
    "createdBy": "admin"
  }'

# 3. 开始生产（扣减库存）
curl -X PATCH https://your-domain.vercel.app/api/orders/order-id \
  -H "Content-Type: application/json" \
  -H "x-approved-by: admin" \
  -d '{"status": "processing"}'

# 4. 创建测试
curl -X POST https://your-domain.vercel.app/api/tests \
  -H "Content-Type: application/json" \
  -d '{
    "testNo": "T-20250117-ABC",
    "formulaId": "formula-id",
    "formulaName": "PCM-25 标准配方",
    "orderId": "order-id",
    "orderNo": "PE-20250117-J001",
    "testType": "性能测试",
    "tester": "李四",
    "createdBy": "admin"
  }'

# 5. 完成测试（自动更新订单状态）
curl -X PATCH https://your-domain.vercel.app/api/tests/test-id \
  -H "Content-Type: application/json" \
  -d '{
    "status": "completed",
    "conclusion": "测试通过"
  }'

# 6. 查看订单状态（应该已完成）
curl https://your-domain.vercel.app/api/orders/order-id
```

## 注意事项

1. **数据完整性**: 所有操作都有事务保护，确保数据一致性
2. **库存检查**: 订单创建时会检查库存，但不会阻止创建
3. **状态联动**: 订单状态变更会触发库存操作
4. **测试关联**: 测试完成后会自动更新关联订单状态
5. **权限控制**: 建议在生产环境添加用户权限验证

## 下一步优化

- [ ] 添加用户权限控制
- [ ] 实现批量操作
- [ ] 添加数据导出功能
- [ ] 实现工作流审批
- [ ] 添加通知推送
- [ ] 实现报表生成

---

**最后更新**: 2025-01-17
