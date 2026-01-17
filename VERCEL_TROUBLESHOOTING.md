# Vercel 部署故障排查指南

本文档记录了在 Vercel 部署过程中可能遇到的常见问题及解决方案。

## 错误代码索引

| 错误信息 | 解决方案 |
|---------|---------|
| `ENOENT: no such file or directory, lstat '/vercel/path0/vercel/path0/.next/routes-manifest.json'` | [查看解决方案](#1-找不到-routes-manifestjson) |
| `Build failed with exit code 1` | [查看解决方案](#2-构建失败) |
| `Module not found: Can't resolve` | [查看解决方案](#3-模块找不到) |
| `Timeout during deployment` | [查看解决方案](#4-部署超时) |
| `Environment variable not found` | [查看解决方案](#5-环境变量未找到) |
| `Database connection failed` | [查看解决方案](#6-数据库连接失败) |

## 详细解决方案

### 1. 找不到 routes-manifest.json

**错误信息**:
```
ENOENT: no such file or directory, lstat '/vercel/path0/vercel/path0/.next/routes-manifest.json'
```

**原因分析**:
- Next.js 配置中的 `outputFileTracingRoot` 路径在 Vercel 环境中不正确
- 构建产物未完整生成
- `.next` 目录权限问题

**解决方案**:

#### 步骤 1: 修改 next.config.ts

移除或调整 `outputFileTracingRoot` 配置：

```typescript
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // ✅ 正确: 移除 outputFileTracingRoot
  // ❌ 错误: outputFileTracingRoot: path.resolve(__dirname, '../../'),

  // ✅ 推荐: 使用 standalone 模式
  output: 'standalone',

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
};

export default nextConfig;
```

#### 步骤 2: 本地验证构建

```bash
# 清理旧的构建产物
rm -rf .next

# 重新构建
pnpm run build

# 验证关键文件存在
ls -la .next/routes-manifest.json
ls -la .next/build-manifest.json
```

#### 步骤 3: 检查 vercel.json 配置

确保配置正确：

```json
{
  "buildCommand": "pnpm install && pnpm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "installCommand": "pnpm install"
}
```

#### 步骤 4: 重新部署

```bash
# 提交更改
git add next.config.ts vercel.json
git commit -m "修复 Vercel 部署配置"
git push

# 在 Vercel Dashboard 中手动触发部署
```

---

### 2. 构建失败

**错误信息**:
```
Build failed with exit code 1
```

**常见原因**:
- TypeScript 类型错误
- ESLint 错误
- 依赖安装失败
- 代码逻辑错误

**解决方案**:

#### 步骤 1: 本地运行构建

```bash
# 清理依赖和构建产物
rm -rf node_modules .next

# 重新安装依赖
pnpm install

# 运行构建
pnpm run build
```

#### 步骤 2: 检查 TypeScript 错误

```bash
# 运行类型检查
pnpm run ts-check

# 或直接运行
npx tsc --noEmit
```

#### 步骤 3: 检查 ESLint 错误

```bash
# 运行 Lint 检查
pnpm run lint
```

#### 步骤 4: 查看 Vercel 构建日志

在 Vercel Dashboard 中：
1. 进入项目 → **Deployments**
2. 点击失败的部署
3. 查看 **Build Logs**
4. 定位具体错误信息

---

### 3. 模块找不到

**错误信息**:
```
Module not found: Can't resolve 'xxx'
```

**原因分析**:
- 依赖未正确安装
- 导入路径错误
- 依赖版本不兼容

**解决方案**:

#### 步骤 1: 检查依赖

```bash
# 查看已安装的依赖
pnpm list

# 确认依赖存在
pnpm list <package-name>
```

#### 步骤 2: 重新安装依赖

```bash
# 删除 node_modules 和锁文件
rm -rf node_modules pnpm-lock.yaml

# 清理 pnpm 缓存
pnpm store prune

# 重新安装
pnpm install
```

#### 步骤 3: 检查导入路径

确保导入路径正确：
```typescript
// ✅ 正确
import { Button } from '@/components/ui/button'

// ❌ 错误
import { Button } from 'components/ui/button'
```

#### 步骤 4: 检查 tsconfig.json

确保路径别名配置正确：
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

---

### 4. 部署超时

**错误信息**:
```
Timeout during deployment
```

**原因分析**:
- 构建时间过长（超过 Vercel 免费套餐限制）
- 网络问题
- 依赖下载缓慢

**解决方案**:

#### 步骤 1: 优化构建时间

```typescript
// next.config.ts - 启用 Turbopack
const nextConfig: NextConfig = {
  experimental: {
    turbo: {}
  }
};
```

#### 步骤 2: 使用预安装的依赖

```bash
# 在 vercel.json 中使用 prefer-offline
{
  "installCommand": "pnpm install --prefer-offline"
}
```

#### 步骤 3: 升级 Vercel 套餐

如果构建时间持续超过限制，考虑升级到 Pro 套餐。

---

### 5. 环境变量未找到

**错误信息**:
```
Error: Environment variable DATABASE_URL not found
```

**原因分析**:
- 环境变量未配置
- 环境变量配置在错误的环境（Development 而非 Production）
- 变量名拼写错误

**解决方案**:

#### 步骤 1: 检查环境变量配置

在 Vercel Dashboard 中：
1. 进入项目 → **Settings** → **Environment Variables**
2. 确认所有必需变量已添加
3. 确认选择了正确的环境（Production / Preview / Development）

#### 步骤 2: 验证变量名

确保变量名拼写正确：
```bash
# ✅ 正确
DATABASE_URL=postgresql://...

# ❌ 错误
DB_URL=postgresql://...
DATABASEURL=postgresql://...
```

#### 步骤 3: 使用 Vercel CLI 配置

```bash
# 添加环境变量
vercel env add DATABASE_URL production

# 查看所有环境变量
vercel env ls

# 删除环境变量
vercel env rm DATABASE_URL production
```

#### 步骤 4: 重新部署

环境变量更改后需要重新部署：
```bash
# 在 Vercel Dashboard 中点击 "Redeploy"
# 或使用 CLI
vercel --prod
```

---

### 6. 数据库连接失败

**错误信息**:
```
Error: connection failed
```

**原因分析**:
- 数据库连接字符串错误
- 数据库不允许外部访问
- 数据库凭据错误
- 网络防火墙阻止

**解决方案**:

#### 步骤 1: 验证连接字符串

确保 `DATABASE_URL` 格式正确：
```
postgresql://username:password@host:port/database
```

#### 步骤 2: 检查数据库访问权限

**Supabase**:
- 确保项目处于活跃状态
- 检查连接限制是否已达到

**Neon**:
- 确认分支和项目设置正确

**自建 PostgreSQL**:
- 配置白名单允许 Vercel IP 地址访问
- 检查防火墙规则

#### 步骤 3: 测试连接

```bash
# 使用 psql 测试连接
psql $DATABASE_URL

# 或使用 node 脚本测试
node -e "const pg = require('pg'); const client = new pg.Client({ connectionString: process.env.DATABASE_URL }); client.connect().then(() => { console.log('Connected!'); client.end(); }).catch(console.error);"
```

#### 步骤 4: 检查 SSL 配置

某些数据库需要 SSL 连接：
```
postgresql://username:password@host:port/database?sslmode=require
```

---

## 预防措施

### 1. 部署前检查

在推送代码前运行本地检查：

```bash
# 运行部署前检查脚本
bash scripts/pre-deploy-check.sh

# 运行类型检查
pnpm run ts-check

# 运行构建测试
pnpm run build
```

### 2. 使用预览部署

在合并到主分支前使用 Preview 环境：
1. 创建功能分支
2. 推送到 GitHub
3. Vercel 自动创建预览部署
4. 验证功能正常后再合并

### 3. 监控部署状态

在 Vercel Dashboard 中：
1. 设置部署失败通知
2. 定期检查部署日志
3. 监控应用性能指标

### 4. 备份关键配置

- 定期导出环境变量配置
- 保存数据库备份
- 记录重要配置更改

## 获取帮助

如果以上解决方案无法解决问题：

1. **查看详细日志**: 在 Vercel Dashboard 中查看完整的构建和部署日志
2. **检查 GitHub Issues**: 在 [Vercel GitHub Issues](https://github.com/vercel/vercel/issues) 中搜索类似问题
3. **查看 Next.js 文档**: [https://nextjs.org/docs](https://nextjs.org/docs)
4. **联系 Vercel 支持**: [https://vercel.com/support](https://vercel.com/support)

## 更新日志

- 2025-01-17: 添加 routes-manifest.json 错误解决方案
- 2025-01-17: 初始版本，包含常见部署问题

---

**注意**: 本文档会持续更新，记录新的问题和解决方案。如果您遇到未记录的问题，请反馈给开发团队。
