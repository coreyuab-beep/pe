# Passive Edge 订单生产测试管理系统 - 云端部署指南

## 目录
- [部署方式选择](#部署方式选择)
- [方式一：Vercel 部署（推荐）](#方式一vercel-部署推荐)
- [方式二：Docker 部署](#方式二docker-部署)
- [方式三：云服务器部署](#方式三云服务器部署)
- [环境变量配置](#环境变量配置)
- [数据库配置](#数据库配置)
- [域名配置](#域名配置)
- [安全建议](#安全建议)

---

## 部署方式选择

| 部署方式 | 难度 | 成本 | 适用场景 |
|---------|------|------|----------|
| Vercel | ⭐ 简单 | 免费额度 / 按量付费 | 快速上线、中小企业 |
| Docker | ⭐⭐ 中等 | 自建服务器费用 | 需要完全控制、大规模应用 |
| 云服务器 | ⭐⭐⭐ 较难 | 服务器费用 | 企业级应用、自定义需求 |

---

## 方式一：Vercel 部署（推荐）

Vercel 是 Next.js 官方推荐的部署平台，提供免费的 HTTPS、CDN 和自动部署。

### 前置要求
- GitHub / GitLab / Bitbucket 账号
- Vercel 账号（[注册](https://vercel.com/signup)）

### 部署步骤

#### 1. 准备代码仓库

```bash
# 初始化 Git 仓库（如果还没有）
git init

# 添加所有文件
git add .

# 提交代码
git commit -m "Initial commit"

# 推送到 GitHub
git branch -M main
git remote add origin https://github.com/your-username/your-repo.git
git push -u origin main
```

#### 2. 在 Vercel 创建项目

1. 登录 [Vercel Dashboard](https://vercel.com/dashboard)
2. 点击 "Add New" → "Project"
3. 导入你的 GitHub 仓库
4. 配置项目设置：

```
Framework Preset: Next.js
Root Directory: ./
Build Command: pnpm install && pnpm run build
Output Directory: .next
Install Command: pnpm install
```

5. 点击 "Deploy"

#### 3. 配置环境变量

在 Vercel 项目设置中添加以下环境变量：

```
NEXT_PUBLIC_APP_URL=https://your-project.vercel.app
NEXT_PUBLIC_APP_NAME=Passive Edge 订单生产测试管理系统
NODE_ENV=production
```

#### 4. 配置数据库（可选）

如果你使用外部数据库，添加数据库连接字符串：

```
DATABASE_URL=postgresql://user:password@host:5432/database
```

#### 5. 部署完成

- Vercel 会自动构建和部署
- 部署完成后，你会获得一个类似 `https://your-project.vercel.app` 的访问地址
- 后续每次推送代码都会自动触发重新部署

#### 6. 自定义域名（可选）

1. 在项目设置中点击 "Domains"
2. 添加你的域名（如 `app.yourdomain.com`）
3. 按照提示配置 DNS 记录：
   - 类型：CNAME
   - 名称：app
   - 值：cname.vercel-dns.com

### Vercel 免费额度

- ✅ 100GB 带宽/月
- ✅ 6,000 分钟构建时间/月
- ✅ 无限部署次数
- ✅ 自动 HTTPS
- ✅ 全球 CDN

---

## 方式二：Docker 部署

使用 Docker 可以在任何支持 Docker 的平台上运行。

### 前置要求
- Docker 已安装
- Docker Compose 已安装（可选）

### 部署步骤

#### 1. 创建 Dockerfile

项目已包含基础配置，可以创建自定义的 Dockerfile：

```dockerfile
# Dockerfile
FROM node:18-alpine AS base

# 安装依赖阶段
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json pnpm-lock.yaml* ./
RUN corepack enable pnpm && pnpm install --frozen-lockfile

# 构建阶段
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED 1
RUN corepack enable pnpm && pnpm run build

# 运行阶段
FROM base AS runner
WORKDIR /app
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

#### 2. 构建镜像

```bash
docker build -t passive-edge-app .
```

#### 3. 运行容器

```bash
docker run -p 3000:3000 -e DATABASE_URL="your-db-url" passive-edge-app
```

#### 4. 使用 Docker Compose（推荐）

创建 `docker-compose.yml`：

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=${DATABASE_URL}
      - NEXT_PUBLIC_APP_URL=${APP_URL}
    restart: unless-stopped
```

运行：

```bash
docker-compose up -d
```

---

## 方式三：云服务器部署

适合需要完全控制服务器环境的场景。

### 支持的云服务商
- 阿里云 ECS
- 腾讯云 CVM
- 华为云 ECS
- AWS EC2
- Google Cloud Compute Engine

### 部署步骤

#### 1. 准备服务器

```bash
# 连接到服务器
ssh user@your-server-ip

# 安装 Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 安装 pnpm
npm install -g pnpm

# 安装 Git
sudo apt-get install -y git

# 安装 Nginx（用于反向代理）
sudo apt-get install -y nginx
```

#### 2. 克隆代码

```bash
git clone https://github.com/your-username/your-repo.git
cd your-repo
```

#### 3. 安装依赖并构建

```bash
pnpm install
pnpm run build
```

#### 4. 使用 PM2 管理进程

```bash
# 安装 PM2
npm install -g pm2

# 启动应用
pm2 start npm --name "passive-edge" -- start

# 设置开机自启
pm2 startup
pm2 save
```

#### 5. 配置 Nginx 反向代理

创建 `/etc/nginx/sites-available/passive-edge`：

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

启用配置：

```bash
sudo ln -s /etc/nginx/sites-available/passive-edge /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### 6. 配置 SSL 证书（使用 Let's Encrypt）

```bash
# 安装 Certbot
sudo apt-get install -y certbot python3-certbot-nginx

# 获取证书
sudo certbot --nginx -d your-domain.com

# 自动续期
sudo certbot renew --dry-run
```

---

## 环境变量配置

### 必需的环境变量

```bash
# 应用基础配置
NEXT_PUBLIC_APP_URL=https://your-domain.com
NEXT_PUBLIC_APP_NAME=Passive Edge 订单生产测试管理系统
NODE_ENV=production

# 数据库配置（如果使用数据库）
DATABASE_URL=postgresql://user:password@host:5432/database

# 对象存储配置（如果需要文件上传）
AWS_ACCESS_KEY_ID=your-access-key-id
AWS_SECRET_ACCESS_KEY=your-secret-access-key
AWS_REGION=ap-south-1
AWS_S3_BUCKET=your-bucket-name
```

### 在不同平台配置环境变量

**Vercel**:
- Project Settings → Environment Variables

**Docker**:
- 使用 `-e` 参数或 `.env` 文件

**云服务器**:
- 创建 `/etc/environment` 或使用 PM2 生态系统文件

---

## 数据库配置

### 使用 PostgreSQL（推荐）

1. 选择数据库提供商：
   - [Supabase](https://supabase.com)（免费）
   - [Neon](https://neon.tech)（免费）
   - [AWS RDS](https://aws.amazon.com/rds/)
   - 阿里云 RDS / 腾讯云 PostgreSQL

2. 创建数据库实例
3. 获取连接字符串
4. 配置到环境变量

### 使用 Supabase（免费推荐）

1. 注册 [Supabase](https://supabase.com)
2. 创建新项目
3. 在 Settings → Database 获取连接字符串
4. 添加到环境变量

---

## 域名配置

### 购买域名
- 阿里云
- 腾讯云
- Namecheap
- GoDaddy

### DNS 配置

根据你的部署平台配置 DNS：

**Vercel**:
- 添加 CNAME 记录指向 `cname.vercel-dns.com`

**云服务器**:
- 添加 A 记录指向服务器 IP 地址

---

## 安全建议

1. **使用 HTTPS**
   - 所有部署方式都应启用 HTTPS
   - Vercel 自动提供
   - 云服务器使用 Let's Encrypt

2. **保护环境变量**
   - 不要将敏感信息提交到代码仓库
   - 使用 `.env.example` 作为模板
   - 定期轮换密钥

3. **配置防火墙**
   - 只开放必要的端口（80, 443, 22）
   - 限制 SSH 访问

4. **定期备份**
   - 数据库定期备份
   - 配置文件备份
   - 代码版本控制

5. **监控和日志**
   - 配置应用日志收集
   - 设置性能监控
   - 配置错误告警

---

## 常见问题

### Q: Vercel 部署失败？
A: 检查：
- `package.json` 中的构建命令是否正确
- 环境变量是否配置完整
- 依赖是否都能正常安装

### Q: 如何更新生产环境？
A:
- **Vercel**: 推送代码到主分支，自动触发部署
- **Docker**: 重新构建镜像并重启容器
- **云服务器**: 拉取最新代码并重新构建

### Q: 成本估算？
A:
- **Vercel 免费版**: 适合小型应用（每月 100GB 流量）
- **Vercel Pro**: $20/月（适合中型应用）
- **云服务器**: 根据配置而定（约 ¥50-200/月）

---

## 快速部署检查清单

- [ ] 代码已推送到 Git 仓库
- [ ] 环境变量已配置
- [ ] 数据库已创建（如需要）
- [ ] 域名已购买并配置 DNS
- [ ] HTTPS 证书已配置
- [ ] 防火墙规则已设置
- [ ] 监控和日志已配置
- [ ] 备份策略已制定

---

## 获取帮助

如果遇到部署问题，可以：
1. 检查 [Next.js 部署文档](https://nextjs.org/docs/deployment)
2. 查看 [Vercel 文档](https://vercel.com/docs)
3. 提交 Issue 到项目仓库
