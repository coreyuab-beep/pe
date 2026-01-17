# Vercel 快速部署验证步骤

本指南提供了从零开始将项目部署到 Vercel 的快速验证步骤。

## 前置条件检查

### 1. 验证本地环境

```bash
# 运行部署前检查
bash scripts/pre-deploy-check.sh
```

该脚本会检查：
- ✅ 必需文件是否完整
- ✅ 环境变量配置
- ✅ Node.js 版本（≥18）
- ✅ pnpm 版本（≥9）
- ✅ Git 配置
- ✅ 构建配置
- ✅ TypeScript 配置
- ✅ Vercel 配置

## 部署步骤

### 步骤 1: 准备代码

```bash
# 确保所有更改已提交
git status
git add .
git commit -m "准备部署到 Vercel"

# 推送到 GitHub
git push origin main
```

### 步骤 2: 连接 GitHub 到 Vercel

1. 访问 [Vercel Dashboard](https://vercel.com/dashboard)
2. 点击 **"Add New..."** → **"Project"**
3. 选择您的 GitHub 仓库
4. 点击 **"Import"**

### 步骤 3: 配置环境变量

在 Vercel 项目设置的 **"Environment Variables"** 中添加：

```bash
# 数据库（必填）
DATABASE_URL=postgresql://user:password@host:5432/database

# 对象存储（必填）
AWS_ACCESS_KEY_ID=your-access-key-id
AWS_SECRET_ACCESS_KEY=your-secret-access-key
AWS_REGION=ap-south-1
AWS_S3_BUCKET=your-bucket-name

# 应用配置（必填）
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

### 步骤 4: 触发部署

点击 **"Deploy"** 按钮，等待部署完成（约 2-3 分钟）。

## 部署验证

### 1. 基础验证

部署完成后，访问 Vercel 提供的域名，验证：

```bash
# 替换为您的实际域名
APP_URL="https://your-project-name.vercel.app"

# 使用健康检查脚本
bash scripts/health-check.sh $APP_URL
```

或手动检查：

- ✅ 主页是否正常加载
- ✅ 登录页面是否可访问
- ✅ 页面样式是否正常

### 2. 功能验证

1. **登录测试**
   - 访问登录页面
   - 使用默认账号登录：`admin` / `admin123`
   - 验证登录是否成功

2. **功能模块测试**
   - 访问订单管理页面
   - 访问配方管理页面
   - 访问物料管理页面
   - 访问配方测试页面
   - 访问系统设置页面

3. **API 测试**
   ```bash
   # 测试登录 API
   curl -X POST https://your-domain.vercel.app/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"username":"admin","password":"admin123"}'
   ```

### 3. 安全验证

检查安全头是否正确配置：

```bash
curl -I https://your-domain.vercel.app
```

预期输出包含：
```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
```

## 常见问题排查

### 问题 1: 部署失败

**症状**: 构建失败，报错信息

**解决方案**:
```bash
# 本地运行构建测试
pnpm install
pnpm run build

# 查看构建日志
# 在 Vercel Dashboard 中查看详细错误信息
```

### 问题 2: 环境变量未生效

**症状**: 应用无法读取环境变量

**解决方案**:
1. 检查环境变量是否添加到 Production 环境
2. 重新触发部署
3. 验证变量名拼写是否正确

### 问题 3: 数据库连接失败

**症状**: 应用无法连接数据库

**解决方案**:
1. 检查 `DATABASE_URL` 是否正确
2. 确认数据库允许外部访问
3. 验证数据库凭据

### 问题 4: 页面 404 错误

**症状**: 访问页面返回 404

**解决方案**:
1. 检查路由配置
2. 确认部署包含所有文件
3. 查看构建日志

## 部署后操作

### 1. 修改默认密码

⚠️ **重要**: 首次部署后立即修改默认密码！

1. 登录系统
2. 进入 **"系统设置"** 页面
3. 在 **"修改密码"** 区域输入新密码
4. 保存并重新登录

### 2. 配置自定义域名（可选）

1. 进入 Vercel 项目 → **Settings** → **Domains**
2. 添加自定义域名
3. 在域名注册商处配置 DNS
4. 等待 DNS 生效

### 3. 设置告警通知

1. 进入 Vercel 项目 → **Settings** → **Notifications**
2. 配置以下告警：
   - 部署失败
   - 错误率过高
   - 响应时间过长

### 4. 配置数据库备份

根据使用的数据库服务配置定期备份：

- **Supabase**: 自动备份，可在 Dashboard 中配置
- **Neon**: 支持快照备份
- **自建 PostgreSQL**: 使用 pg_dump 定期备份

### 5. 监控应用状态

定期检查：
- Vercel Dashboard 中的部署状态
- 应用日志和错误率
- 性能指标（响应时间、带宽使用）

## 验证清单

部署完成后，使用以下清单验证：

- [ ] 代码已推送到 GitHub
- [ ] 环境变量已全部配置
- [ ] 部署成功完成
- [ ] 主页可正常访问
- [ ] 登录功能正常
- [ ] 所有功能模块可访问
- [ ] API 接口正常响应
- [ ] 安全头配置正确
- [ ] 默认密码已修改
- [ ] 自定义域名已配置（可选）
- [ ] 告警通知已配置
- [ ] 数据库备份已设置

## 下一步

部署完成后，建议：

1. 导入测试数据
2. 创建测试用户并分配权限
3. 执行完整的系统测试
4. 配置生产环境监控
5. 制定运维和备份策略

## 获取帮助

如果遇到问题：

1. 查看 [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md) 详细文档
2. 检查 Vercel 部署日志
3. 访问 [Vercel 文档](https://vercel.com/docs)
4. 联系技术支持

---

**部署完成后，您的应用将可通过 Vercel 提供的域名访问！** 🚀
