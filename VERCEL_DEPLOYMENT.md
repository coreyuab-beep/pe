# Vercel 云端部署指南

本指南将帮助您将 Passive Edge 订单生产测试管理系统部署到 Vercel 平台。

## 目录

- [前置准备](#前置准备)
- [部署步骤](#部署步骤)
- [环境变量配置](#环境变量配置)
- [数据库配置](#数据库配置)
- [对象存储配置](#对象存储配置)
- [域名配置](#域名配置)
- [监控与日志](#监控与日志)
- [故障排查](#故障排查)

## 前置准备

### 1. 必需账号

- [GitHub 账号](https://github.com/)（代码托管）
- [Vercel 账号](https://vercel.com/)（部署平台）
- [Supabase/Neon 账号](https://supabase.com/) 或 [PostgreSQL 数据库](https://www.postgresql.org/)（数据存储）
- [AWS S3 账号](https://aws.amazon.com/s3/) 或兼容的对象存储服务（文件存储）

### 2. 本地工具

确保已安装以下工具：

```bash
# 检查 Node.js 版本（建议 18.x 或更高）
node --version

# 检查 pnpm 版本（建议 9.x 或更高）
pnpm --version

# 检查 Git 版本
git --version
```

### 3. 代码准备

确保代码已推送到 GitHub 仓库：

```bash
# 检查远程仓库
git remote -v

# 如果未配置，添加远程仓库
git remote add origin https://github.com/your-username/your-repo.git

# 推送代码
git push -u origin main
```

## 部署步骤

### 步骤 1：连接 GitHub 到 Vercel

1. 登录 [Vercel Dashboard](https://vercel.com/dashboard)
2. 点击 **"Add New..."** → **"Project"**
3. 点击 **"Continue with GitHub"** 授权访问
4. 选择要部署的仓库
5. 点击 **"Import"**

### 步骤 2：配置项目设置

Vercel 会自动识别 Next.js 项目，配置以下信息：

#### 项目信息

- **Project Name**: `passive-edge-system`（可自定义）
- **Framework Preset**: Next.js
- **Root Directory**: `./`（默认）
- **Build Command**: `pnpm install && pnpm run build`（自动检测）
- **Output Directory**: `.next`（自动检测）

#### 环境变量

在 **"Environment Variables"** 部分添加以下变量（详见[环境变量配置](#环境变量配置)）：

```bash
# 数据库配置
DATABASE_URL=postgresql://user:password@host:5432/database

# 对象存储配置
AWS_ACCESS_KEY_ID=your-access-key-id
AWS_SECRET_ACCESS_KEY=your-secret-access-key
AWS_REGION=ap-south-1
AWS_S3_BUCKET=your-bucket-name

# 应用配置
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
NEXT_PUBLIC_APP_NAME=Passive Edge 订单生产测试管理系统

# 环境标识
NODE_ENV=production

# 日志级别
LOG_LEVEL=info

# 认证配置
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123

# 会话配置
SESSION_MAX_AGE=86400
```

### 步骤 3：配置部署区域

在 **"General"** → **"General Settings"** 中：

- **Region**: Hong Kong (hkg1) - 适合中国用户访问
- **Node.js Version**: 18.x 或 20.x（推荐）

### 步骤 4：开始部署

点击 **"Deploy"** 按钮，Vercel 将自动：

1. 克隆代码仓库
2. 安装依赖（`pnpm install`）
3. 运行构建（`pnpm run build`）
4. 部署到全球边缘网络

部署完成后，您将获得一个 Vercel 提供的域名，例如：
```
https://passive-edge-system.vercel.app
```

### 步骤 5：验证部署

访问您的 Vercel 域名，验证：

1. ✅ 页面正常加载
2. ✅ 登录页面可访问
3. ✅ 使用默认账号登录（`admin` / `admin123`）
4. ✅ 检查所有功能模块是否正常

## 环境变量配置

### 必需环境变量

| 变量名 | 说明 | 示例 |
|--------|------|------|
| `DATABASE_URL` | PostgreSQL 数据库连接字符串 | `postgresql://user:pass@host:5432/db` |
| `AWS_ACCESS_KEY_ID` | AWS 访问密钥 ID | `AKIAIOSFODNN7EXAMPLE` |
| `AWS_SECRET_ACCESS_KEY` | AWS 访问密钥 | `wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY` |
| `AWS_REGION` | AWS 区域 | `ap-south-1` |
| `AWS_S3_BUCKET` | S3 存储桶名称 | `passive-edge-bucket` |
| `NEXT_PUBLIC_APP_URL` | 应用访问 URL | `https://passive-edge.vercel.app` |
| `NEXT_PUBLIC_APP_NAME` | 应用名称 | `Passive Edge 订单生产测试管理系统` |
| `NODE_ENV` | 运行环境 | `production` |
| `LOG_LEVEL` | 日志级别 | `info` / `debug` / `error` |
| `ADMIN_USERNAME` | 管理员用户名 | `admin` |
| `ADMIN_PASSWORD` | 管理员密码 | `admin123` |
| `SESSION_MAX_AGE` | 会话有效期（秒） | `86400` |

### 安全提示

⚠️ **重要**：
- 首次部署后，请立即登录系统修改默认密码
- 不要在生产环境使用默认密码
- 生产环境建议使用更强的密码策略
- 敏感信息（如 API Key）使用 Vercel 环境变量加密存储

### 配置环境变量

#### 通过 Vercel Dashboard

1. 进入项目 → **Settings** → **Environment Variables**
2. 点击 **"Add New"**
3. 输入变量名和值
4. 选择环境（Production / Preview / Development）
5. 点击 **"Save"**

#### 通过 Vercel CLI

```bash
# 安装 Vercel CLI
pnpm add -g vercel

# 登录 Vercel
vercel login

# 添加环境变量
vercel env add DATABASE_URL production
vercel env add AWS_ACCESS_KEY_ID production
# ... 添加其他变量

# 查看所有环境变量
vercel env ls
```

## 数据库配置

### 方案 1：使用 Supabase（推荐）

Supabase 提供 PostgreSQL 数据库和对象存储，配置简单。

#### 创建 Supabase 项目

1. 访问 [Supabase](https://supabase.com/) 并登录
2. 点击 **"New Project"**
3. 填写项目信息：
   - **Name**: `passive-edge-db`
   - **Database Password**: 生成强密码
   - **Region**: 选择靠近您的区域（如 Northeast Asia）
4. 等待项目创建完成（约 2 分钟）

#### 获取数据库连接字符串

1. 进入项目 → **Settings** → **Database**
2. 复制 **Connection String** (Postgres URI)
3. 替换 `[YOUR-PASSWORD]` 为实际密码

示例：
```
postgresql://postgres:[YOUR-PASSWORD]@db.xxx.supabase.co:5432/postgres
```

#### 配置环境变量

在 Vercel 中添加：
```bash
DATABASE_URL=postgresql://postgres:your-password@db.xxx.supabase.co:5432/postgres
```

#### 初始化数据库表

Supabase 项目创建后，需要手动创建数据库表。使用以下 SQL：

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

### 方案 2：使用 Neon

Neon 是一个无服务器 PostgreSQL，适合 Serverless 应用。

#### 创建 Neon 项目

1. 访问 [Neon](https://neon.tech/) 并登录
2. 点击 **"Create a project"**
3. 选择区域并命名项目
4. 复制连接字符串

#### 配置环境变量

```bash
DATABASE_URL=postgresql://user:password@ep-xxx.aws.neon.tech/neondb?sslmode=require
```

### 方案 3：使用自建 PostgreSQL

如果您已有 PostgreSQL 服务器，直接使用连接字符串即可：

```bash
DATABASE_URL=postgresql://user:password@your-host:5432/your-database
```

确保数据库允许来自 Vercel 的外部访问（需要配置白名单）。

## 对象存储配置

### 方案 1：使用 AWS S3

#### 创建 S3 存储桶

1. 登录 [AWS Console](https://console.aws.amazon.com/)
2. 进入 **S3** 服务
3. 点击 **"Create bucket"**
4. 填写配置：
   - **Bucket name**: `passive-edge-bucket`（全局唯一）
   - **Region**: 选择一个区域（如 Asia Pacific (Mumbai)）
5. 点击 **"Create bucket"**

#### 创建 IAM 用户

1. 进入 **IAM** 服务
2. 点击 **"Users"** → **"Create user"**
3. 用户名：`passive-edge-s3-user`
4. 权限：附加 **"AmazonS3FullAccess"** 策略（生产环境建议使用最小权限策略）
5. 创建后记录：
   - **Access Key ID**
   - **Secret Access Key**

#### 配置环境变量

```bash
AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
AWS_REGION=ap-south-1
AWS_S3_BUCKET=passive-edge-bucket
```

### 方案 2：使用 Supabase Storage

如果使用 Supabase 作为数据库，可以直接使用其 Storage 服务。

#### 创建存储桶

1. 进入 Supabase 项目 → **Storage**
2. 点击 **"New bucket"**
3. 名称：`uploads`
4. 权限：**Public** 或 **Private**（根据需求）
5. 获取存储配置信息

#### 配置环境变量

Supabase Storage 兼容 S3 API，可以使用相同的配置方式：

```bash
AWS_ACCESS_KEY_ID=your-supabase-access-key
AWS_SECRET_ACCESS_KEY=your-supabase-secret-key
AWS_REGION=ap-south-1
AWS_S3_BUCKET=uploads
```

### 方案 3：使用其他 S3 兼容服务

以下服务兼容 S3 API：

- **Cloudflare R2**
- **MinIO**
- **DigitalOcean Spaces**
- **阿里云 OSS**
- **腾讯云 COS**

配置方式与 AWS S3 类似，只需更换对应的 Endpoint 和 Region。

## 域名配置

### 使用 Vercel 默认域名

部署完成后，Vercel 会提供一个免费域名：
```
https://your-project-name.vercel.app
```

### 配置自定义域名

#### 方案 1：使用 Vercel 域名

1. 进入项目 → **Settings** → **Domains**
2. 输入域名（如 `passive-edge.com`）
3. Vercel 会提供 DNS 配置信息
4. 在域名注册商处添加 DNS 记录

#### 方案 2：使用第三方域名

1. 购买域名（如阿里云、腾讯云、GoDaddy）
2. 进入域名管理 → DNS 设置
3. 添加以下记录：

| 类型 | 名称 | 值 | TTL |
|------|------|-----|-----|
| CNAME | www | cname.vercel-dns.com | 600 |
| CNAME | @ | cname.vercel-dns.com | 600 |

4. 在 Vercel 中添加域名并等待验证

#### 配置 HTTPS

Vercel 自动为所有域名提供免费 SSL 证书（Let's Encrypt），无需额外配置。

## 监控与日志

### Vercel Dashboard

访问 Vercel Dashboard 查看以下信息：

- **部署历史**: 查看所有部署记录
- **实时日志**: 查看应用运行日志
- **函数日志**: 查看 API Route 日志
- **性能指标**: 响应时间、错误率等
- **带宽使用**: 流量统计

### 配置告警

1. 进入项目 → **Settings** → **Notifications**
2. 配置告警通知：
   - **部署失败**
   - **错误率过高**
   - **响应时间过长**
3. 选择通知方式：
   - Email
   - Slack
   - Webhook

### 日志级别配置

根据环境调整日志级别：

```bash
# 开发环境
LOG_LEVEL=debug

# 生产环境
LOG_LEVEL=info

# 仅错误
LOG_LEVEL=error
```

## 故障排查

### 常见问题

#### 1. 部署失败 - 找不到 routes-manifest.json

**症状**: 部署时报错 `ENOENT: no such file or directory, lstat '/vercel/path0/vercel/path0/.next/routes-manifest.json'`

**原因**: Next.js 配置中的 `outputFileTracingRoot` 路径在 Vercel 环境中不正确

**解决方案**:
1. 修改 `next.config.ts`，移除或调整 `outputFileTracingRoot` 配置
2. 使用 `output: 'standalone'` 模式进行构建
3. 本地重新构建并验证：

```bash
# 清理构建产物
rm -rf .next

# 重新构建
pnpm run build

# 验证 routes-manifest.json 存在
ls -la .next/routes-manifest.json
```

4. 提交更改并重新部署到 Vercel

**修复后的 `next.config.ts`**:
```typescript
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // 移除 outputFileTracingRoot 以避免 Vercel 部署路径问题
  // Vercel 会自动处理文件追踪
  allowedDevOrigins: ['*.dev.coze.site'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lf-coze-web-cdn.coze.cn',
        pathname: '/**',
      },
    ],
  },
  // 确保输出目录正确
  output: 'standalone',
};

export default nextConfig;
```

#### 2. 构建失败

**症状**: 构建失败，报错信息

**解决方案**:
- 检查构建日志，定位错误
- 确认 `pnpm` 版本兼容
- 检查依赖是否完整
- 查看 Vercel 部署日志详情

#### 2. 环境变量未生效

**症状**: 应用无法读取环境变量

**解决方案**:
- 确认环境变量已添加到 Production 环境
- 重新部署项目：`vercel --prod`
- 检查变量名拼写是否正确

#### 3. 数据库连接失败

**症状**: 应用无法连接数据库

**解决方案**:
- 检查 `DATABASE_URL` 是否正确
- 确认数据库允许外部访问
- 检查防火墙设置
- 验证数据库凭据

#### 4. S3 上传失败

**症状**: 文件上传到对象存储失败

**解决方案**:
- 检查 AWS 凭据是否有效
- 确认存储桶权限配置正确
- 检查区域配置
- 验证网络连接

#### 5. 页面 404 错误

**症状**: 访问页面返回 404

**解决方案**:
- 检查路由配置是否正确
- 确认文件路径拼写
- 检查部署是否包含所有文件

### 获取帮助

- **Vercel 文档**: [https://vercel.com/docs](https://vercel.com/docs)
- **Next.js 文档**: [https://nextjs.org/docs](https://nextjs.org/docs)
- **Vercel Discord**: [https://vercel.com/discord](https://vercel.com/discord)

## 进阶配置

### 自定义构建命令

如果需要自定义构建流程，可以在 `vercel.json` 中修改：

```json
{
  "buildCommand": "pnpm install && pnpm run build",
  "devCommand": "pnpm run dev"
}
```

### 配置重定向

在 `vercel.json` 中添加重定向规则：

```json
{
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "/api/:path*"
    }
  ]
}
```

### 配置缓存策略

```json
{
  "headers": [
    {
      "source": "/static/:path*",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

## 部署清单

部署前请确认：

- [ ] 代码已推送到 GitHub
- [ ] 环境变量已全部配置
- [ ] 数据库已创建并初始化
- [ ] 对象存储已配置
- [ ] 域名已设置（可选）
- [ ] HTTPS 已启用
- [ ] 告警通知已配置
- [ ] 默认密码已修改
- [ ] 备份策略已制定

## 部署后操作

部署完成后，建议执行以下操作：

1. **修改默认密码**: 使用 `admin` 登录后立即修改密码
2. **创建测试数据**: 导入示例订单、配方、物料数据
3. **配置用户权限**: 添加其他用户并分配角色
4. **设置定时备份**: 配置数据库定期备份
5. **监控运行状态**: 定期检查日志和性能指标
6. **更新文档**: 记录部署信息和配置变更

## 成本估算

### Vercel 免费套餐

- **带宽**: 100 GB/月
- **Serverless Function**: 100 GB-hrs/月
- **构建时长**: 6,000 分钟/月
- **适合**: 小型项目、测试环境

### Vercel Pro 套餐

- **带宽**: 1 TB/月
- **Serverless Function**: 1,000 GB-hrs/月
- **价格**: $20/月
- **适合**: 生产环境、中型项目

### 数据库成本

- **Supabase 免费套餐**: 500 MB 存储，2 GB 传输/月
- **Neon 免费套餐**: 0.5 GB 存储，无限制连接
- **自建 PostgreSQL**: 根据服务器配置计费

### 对象存储成本

- **AWS S3**: $0.023/GB/月（标准存储）
- **Supabase Storage**: 包含在数据库套餐中

## 总结

通过本指南，您应该能够成功将 Passive Edge 订单生产测试管理系统部署到 Vercel 平台。如果在部署过程中遇到问题，请参考[故障排查](#故障排查)部分或联系技术支持。

祝您部署顺利！🚀
