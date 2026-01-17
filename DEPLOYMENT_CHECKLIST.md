# Vercel 部署配置清单

本清单将引导你完成 Vercel 部署的所有配置步骤。

## 📋 部署前检查

### 1. 环境准备

- [x] 代码已推送到 GitHub
- [ ] Vercel 账号已注册
- [ ] GitHub 账号已连接到 Vercel
- [ ] 数据库服务已准备（Supabase/Neon/自建）
- [ ] 对象存储服务已准备（AWS S3/兼容服务）

### 2. 运行本地检查

```bash
# 运行部署前检查脚本
bash scripts/pre-deploy-check.sh
```

预期输出：
```
======================================
验证结果汇总
======================================
总检查数: XX
通过: XX
失败: 0
======================================
✓ 所有检查通过！可以进行部署。
```

## 🔧 Vercel 配置步骤

### 步骤 1: 连接 GitHub 到 Vercel

1. 访问 [Vercel Dashboard](https://vercel.com/dashboard)
2. 点击右上角 **"Add New..."** → **"Project"**
3. 点击 **"Continue with GitHub"**
4. 授权 Vercel 访问你的 GitHub 仓库
5. 选择仓库 `coreyuab-beep/pe`
6. 点击 **"Import"**

### 步骤 2: 配置项目设置

Vercel 会自动识别 Next.js 项目，确认以下配置：

| 配置项 | 值 |
|--------|-----|
| Project Name | `pe` 或自定义名称 |
| Framework Preset | Next.js |
| Root Directory | `./` |
| Build Command | `pnpm install && pnpm run build` |
| Output Directory | `.next` |
| Install Command | `pnpm install` |

### 步骤 3: 配置环境变量 ⚠️ **关键步骤**

在 **"Environment Variables"** 部分添加以下变量（全部添加到 **Production** 环境）：

#### 必需配置

```bash
# ===== 数据库配置 =====
DATABASE_URL=postgresql://user:password@host:5432/database
# 替换为你的实际数据库连接字符串
# Supabase 示例: postgresql://postgres:[password]@db.xxx.supabase.co:5432/postgres
# Neon 示例: postgresql://user:password@ep-xxx.aws.neon.tech/neondb?sslmode=require

# ===== 对象存储配置 =====
AWS_ACCESS_KEY_ID=your-access-key-id
# 替换为你的 AWS 访问密钥 ID

AWS_SECRET_ACCESS_KEY=your-secret-access-key
# 替换为你的 AWS 访问密钥

AWS_REGION=ap-south-1
# 根据你的存储桶位置修改，常见值：
# - ap-south-1 (Mumbai)
# - ap-southeast-1 (Singapore)
# - ap-northeast-1 (Tokyo)
# - us-east-1 (N. Virginia)

AWS_S3_BUCKET=your-bucket-name
# 替换为你的 S3 存储桶名称

# ===== 应用配置 =====
NEXT_PUBLIC_APP_URL=https://your-project.vercel.app
# 部署后替换为实际的 Vercel 域名

NEXT_PUBLIC_APP_NAME=Passive Edge 订单生产测试管理系统
# 应用名称，保持不变

# ===== 环境配置 =====
NODE_ENV=production
# 固定为 production

LOG_LEVEL=info
# 日志级别，可选: debug / info / warn / error

# ===== 认证配置 =====
ADMIN_USERNAME=admin
# 管理员用户名，保持不变

ADMIN_PASSWORD=admin123
# 管理员密码，⚠️ 部署后立即修改！

SESSION_MAX_AGE=86400
# 会话有效期（秒），86400 = 24小时
```

### 步骤 4: 配置部署区域

在 **"General"** → **"General Settings"** 中：

1. **Region**: 选择 **Hong Kong (hkg1)**
   - 适合中国用户访问
   - 延迟更低

2. **Node.js Version**: 选择 **20.x** 或 **18.x**
   - 推荐使用 20.x

### 步骤 5: 开始部署

1. 点击页面底部的 **"Deploy"** 按钮
2. 等待部署完成（约 2-3 分钟）
3. 部署成功后，你会获得一个 Vercel 域名

示例：`https://pe-xxx.vercel.app`

## ✅ 部署后验证

### 1. 基础验证

访问你的 Vercel 域名，检查：

- [ ] 页面正常加载
- [ ] 自动重定向到登录页面
- [ ] 页面样式正常显示

### 2. 功能验证

#### 登录测试
- [ ] 访问登录页面
- [ ] 使用默认账号登录：`admin` / `admin123`
- [ ] 登录成功后跳转到仪表盘

#### 功能模块测试
- [ ] 订单管理页面可访问
- [ ] 配方管理页面可访问
- [ ] 物料管理页面可访问
- [ ] 配方测试页面可访问
- [ ] 系统设置页面可访问

### 3. API 测试

```bash
# 测试登录 API
curl -X POST https://your-domain.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# 预期响应: 包含登录成功的消息和设置 cookie
```

### 4. 安全检查

```bash
# 检查安全头
curl -I https://your-domain.vercel.app

# 确认包含以下头部:
# X-Content-Type-Options: nosniff
# X-Frame-Options: DENY
# X-XSS-Protection: 1; mode=block
```

### 5. 使用健康检查脚本

```bash
# 运行健康检查
bash scripts/health-check.sh https://your-domain.vercel.app

# 预期所有检查都通过
```

## 🔐 部署后必做

### 1. 修改默认密码 ⚠️ **重要！**

1. 登录系统
2. 点击侧边栏的 **"系统设置"**
3. 在 **"修改密码"** 区域：
   - 当前密码: `admin123`
   - 新密码: 输入强密码（至少 6 位）
   - 确认新密码: 重复输入
4. 点击 **"修改密码"**
5. 使用新密码重新登录

### 2. 配置自定义域名（可选）

如果需要使用自定义域名：

1. 在 Vercel 项目中进入 **Settings** → **Domains**
2. 输入你的域名（如 `passive-edge.com`）
3. 按照提示配置 DNS 记录

DNS 配置示例：

| 类型 | 名称 | 值 | TTL |
|------|------|-----|-----|
| CNAME | www | cname.vercel-dns.com | 600 |
| CNAME | @ | cname.vercel-dns.com | 600 |

### 3. 配置告警通知

1. 进入 **Settings** → **Notifications**
2. 配置以下告警：
   - [ ] 部署失败
   - [ ] 错误率超过阈值
   - [ ] 响应时间过长

### 4. 数据库初始化

如果使用 Supabase/Neon，需要初始化数据库表：

```sql
-- 在 Supabase SQL Editor 或其他数据库工具中运行

-- 创建用户表
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100),
    role VARCHAR(20) DEFAULT 'admin',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 插入默认管理员用户
INSERT INTO users (username, password, role)
VALUES ('admin', 'YWRtaW4xMjM=', 'admin')
ON CONFLICT (username) DO NOTHING;

-- 创建订单表
CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    customer_name VARCHAR(100) NOT NULL,
    quantity INTEGER NOT NULL,
    status VARCHAR(20) DEFAULT '待处理',
    delivery_date DATE,
    formula_id INTEGER,
    notes TEXT,
    creator VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 创建配方表
CREATE TABLE IF NOT EXISTS formulas (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phase_change_temp NUMERIC,
    latent_heat NUMERIC,
    thermal_conductivity NUMERIC,
    version VARCHAR(20) DEFAULT '1.0',
    status VARCHAR(20) DEFAULT '草稿',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 创建物料表
CREATE TABLE IF NOT EXISTS materials (
    id SERIAL PRIMARY KEY,
    code VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(50),
    stock_quantity INTEGER DEFAULT 0,
    unit VARCHAR(20),
    supplier VARCHAR(100),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 创建测试记录表
CREATE TABLE IF NOT EXISTS test_records (
    id SERIAL PRIMARY KEY,
    order_id INTEGER,
    formula_id INTEGER,
    test_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    phase_change_temp_test NUMERIC,
    latent_heat_test NUMERIC,
    thermal_conductivity_test NUMERIC,
    result VARCHAR(20),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 📊 监控与维护

### 定期检查

- [ ] 每周检查部署状态
- [ ] 每月检查应用日志
- [ ] 每季度检查依赖更新

### 备份策略

- [ ] 数据库定期备份
- [ ] 配置导出
- [ ] 重要数据归档

## 🚨 故障排查

如果遇到问题：

1. **查看部署日志**: Vercel Dashboard → Deployments → 点击部署
2. **查看运行日志**: Vercel Dashboard → Logs
3. **参考故障排查**: [VERCEL_TROUBLESHOOTING.md](./VERCEL_TROUBLESHOOTING.md)
4. **检查环境变量**: 确认所有必需变量已配置
5. **验证数据库**: 测试数据库连接是否正常

## 📞 获取帮助

- **Vercel 文档**: https://vercel.com/docs
- **Next.js 文档**: https://nextjs.org/docs
- **Supabase 文档**: https://supabase.com/docs
- **项目文档**: 查看 README.md 中的相关文档链接

---

## ✨ 完成清单

部署完成后，请确认以下事项：

- [ ] Vercel 项目已创建
- [ ] 所有环境变量已配置
- [ ] 部署成功完成
- [ ] 应用可正常访问
- [ ] 登录功能正常
- [ ] 默认密码已修改
- [ ] 数据库已初始化
- [ ] 对象存储已配置
- [ ] 自定义域名已设置（可选）
- [ ] 告警通知已配置

---

**🎉 恭喜！完成以上步骤后，你的应用就成功部署到 Vercel 了！**
