# Vercel 快速配置指南

本指南提供了在 Vercel 上部署 Passive Edge 系统的快速配置步骤。

## 📌 前置检查

✅ **本地环境验证通过**

- Node.js: v24.12.0 ✓
- pnpm: 9.0.0 ✓
- Git 远程仓库: 已配置 ✓
- 所有必需文件: 完整 ✓

## 🚀 Vercel 配置步骤

### 步骤 1: 访问 Vercel

1. 打开浏览器，访问：[https://vercel.com/dashboard](https://vercel.com/dashboard)
2. 如果未登录，使用 GitHub 账号登录

### 步骤 2: 导入项目

1. 点击右上角 **"Add New..."** → **"Project"**
2. 在 "Import Git Repository" 部分找到 `coreyuab-beep/pe`
3. 点击 **"Import"** 按钮

### 步骤 3: 确认项目配置

Vercel 会自动检测到 Next.js 项目，确认以下信息：

```
Framework Preset: Next.js
Root Directory: ./
Build Command: pnpm install && pnpm run build
Output Directory: .next
Install Command: pnpm install
```

✅ **这些配置是正确的，无需修改**

### 步骤 4: 配置环境变量 ⚠️ **最重要**

在 **"Environment Variables"** 部分点击 **"Add New"**，逐个添加以下变量：

#### 必需配置（11 个变量）

```bash
# 1. 数据库配置
DATABASE_URL=postgresql://user:password@host:5432/database

# 2. AWS 访问密钥 ID
AWS_ACCESS_KEY_ID=your-access-key-id

# 3. AWS 访问密钥
AWS_SECRET_ACCESS_KEY=your-secret-access-key

# 4. AWS 区域
AWS_REGION=ap-south-1

# 5. S3 存储桶名称
AWS_S3_BUCKET=your-bucket-name

# 6. 应用 URL（部署后更新）
NEXT_PUBLIC_APP_URL=https://pe-xxx.vercel.app

# 7. 应用名称
NEXT_PUBLIC_APP_NAME=Passive Edge 订单生产测试管理系统

# 8. 运行环境
NODE_ENV=production

# 9. 日志级别
LOG_LEVEL=info

# 10. 管理员用户名
ADMIN_USERNAME=admin

# 11. 管理员密码
ADMIN_PASSWORD=admin123
```

**重要提示**:
- 确保选择环境为 **Production**
- 替换占位符为实际值
- `DATABASE_URL`、`AWS_ACCESS_KEY_ID`、`AWS_SECRET_ACCESS_KEY`、`AWS_S3_BUCKET` 必须填写实际值

### 步骤 5: 配置部署区域

在 **"General"** → **"General Settings"** 中：

1. 找到 **"Region"** 选项
2. 选择 **Hong Kong (hkg1)**
3. 点击 **"Save"**

### 步骤 6: 开始部署

1. 滚动到页面底部
2. 点击 **"Deploy"** 按钮
3. 等待部署完成（约 2-3 分钟）

### 步骤 7: 获取部署信息

部署成功后，你会看到：

```
✅ Deployed!
Production: https://pe-xxx.vercel.app
```

复制这个 URL，后续会用到。

## 📋 环境变量详细说明

### 数据库配置（DATABASE_URL）

#### 使用 Supabase（推荐）

1. 访问 [Supabase](https://supabase.com/) 并创建项目
2. 进入项目 → **Settings** → **Database**
3. 复制 **Connection String** (Postgres URI)
4. 替换 `[YOUR-PASSWORD]` 为实际密码

示例：
```
postgresql://postgres:your-password@db.xxx.supabase.co:5432/postgres
```

#### 使用 Neon

1. 访问 [Neon](https://neon.tech/) 并创建项目
2. 复制连接字符串

示例：
```
postgresql://user:password@ep-xxx.aws.neon.tech/neondb?sslmode=require
```

### 对象存储配置

#### 创建 AWS S3 存储桶

1. 登录 [AWS Console](https://console.aws.amazon.com/)
2. 进入 **S3** 服务
3. 点击 **"Create bucket"**
4. 输入存储桶名称（全局唯一，如 `passive-edge-bucket-2025`）
5. 选择区域（如 **Asia Pacific (Mumbai)** - ap-south-1）
6. 其他配置使用默认值
7. 点击 **"Create bucket"**

#### 创建 IAM 用户

1. 进入 **IAM** 服务
2. 点击 **"Users"** → **"Create user"**
3. 用户名：`passive-edge-s3-user`
4. 权限：附加 **"AmazonS3FullAccess"** 策略
5. 创建后记录 **Access Key ID** 和 **Secret Access Key**

配置环境变量：
```bash
AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
AWS_REGION=ap-south-1
AWS_S3_BUCKET=passive-edge-bucket-2025
```

### 其他配置

```bash
# 应用 URL - 部署后更新
NEXT_PUBLIC_APP_URL=https://your-project.vercel.app

# 应用名称 - 固定值
NEXT_PUBLIC_APP_NAME=Passive Edge 订单生产测试管理系统

# 运行环境 - 固定值
NODE_ENV=production

# 日志级别 - 固定值
LOG_LEVEL=info

# 管理员用户名 - 固定值（首次部署后可修改）
ADMIN_USERNAME=admin

# 管理员密码 - 固定值（首次部署后立即修改）
ADMIN_PASSWORD=admin123
```

## ✅ 部署验证

### 1. 访问应用

打开浏览器，访问你的 Vercel 域名：
```
https://pe-xxx.vercel.app
```

预期：自动重定向到登录页面

### 2. 登录测试

- 用户名：`admin`
- 密码：`admin123`

预期：登录成功，跳转到仪表盘

### 3. 运行健康检查

在本地终端运行：

```bash
bash scripts/health-check.sh https://pe-xxx.vercel.app
```

预期：所有检查通过

## 🔐 部署后必做

### 1. 修改默认密码 ⚠️ **非常重要！**

1. 登录系统
2. 点击侧边栏 **"系统设置"**
3. 在 **"修改密码"** 区域输入：
   - 当前密码：`admin123`
   - 新密码：输入强密码（至少 6 位）
   - 确认新密码：重复输入
4. 点击 **"修改密码"**
5. 使用新密码重新登录

### 2. 初始化数据库（如果使用 Supabase/Neon）

在数据库管理界面运行以下 SQL：

```sql
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

### 3. 更新应用 URL

如果使用自定义域名，更新 `NEXT_PUBLIC_APP_URL` 环境变量：

1. 进入 Vercel 项目 → **Settings** → **Environment Variables**
2. 找到 `NEXT_PUBLIC_APP_URL`
3. 更新值为你的实际域名
4. 点击 **"Save"**
5. 重新部署项目

## 📞 常见问题

### Q1: 部署失败，提示 "Build failed"

**解决方案**:
1. 检查环境变量是否全部配置
2. 查看 Vercel 构建日志
3. 参考 [VERCEL_TROUBLESHOOTING.md](./VERCEL_TROUBLESHOOTING.md)

### Q2: 数据库连接失败

**解决方案**:
1. 检查 `DATABASE_URL` 是否正确
2. 确认数据库允许外部访问
3. 验证数据库凭据

### Q3: 无法登录

**解决方案**:
1. 确认使用正确的用户名和密码（`admin` / `admin123`）
2. 检查浏览器控制台是否有错误
3. 清除浏览器缓存后重试

### Q4: 环境变量未生效

**解决方案**:
1. 确认环境变量添加到 **Production** 环境
2. 重新部署项目
3. 检查变量名拼写是否正确

## 📚 更多文档

- [完整部署清单](./DEPLOYMENT_CHECKLIST.md) - 详细的部署步骤和验证清单
- [详细部署指南](./VERCEL_DEPLOYMENT.md) - 深入的配置说明和故障排查
- [故障排查指南](./VERCEL_TROUBLESHOOTING.md) - 常见问题和解决方案
- [快速部署验证](./VERCEL_QUICK_START.md) - 快速验证步骤

---

## 🎉 完成清单

部署完成后，请确认：

- [ ] Vercel 项目已创建
- [ ] 所有 11 个环境变量已配置
- [ ] 部署成功完成
- [ ] 应用可正常访问
- [ ] 登录功能正常
- [ ] 默认密码已修改
- [ ] 数据库已初始化
- [ ] 对象存储已配置

**🚀 恭喜！你的应用已成功部署到 Vercel！**
