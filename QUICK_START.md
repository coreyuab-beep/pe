# 快速开始指南

欢迎使用 Passive Edge 订单生产测试管理系统！本指南将帮助你在 10 分钟内完成部署。

## 前置准备

在开始之前，请确保你有：

- ✅ GitHub 账号（[注册](https://github.com/signup)）
- ✅ Vercel 账号（[注册](https://vercel.com/signup)，可以使用 GitHub 登录）
- ✅ 代码已克隆到本地

## 🚀 三步完成部署

### 步骤 1: 准备代码

在项目根目录运行：

```bash
# 安装依赖
pnpm install

# 运行部署助手
./deploy-vercel.sh
```

这个脚本会自动：
- ✅ 检查环境
- ✅ 安装依赖
- ✅ 运行类型检查
- ✅ 构建项目
- ✅ 初始化 Git 仓库

### 步骤 2: 推送到 GitHub

如果还没有 GitHub 仓库，执行：

```bash
# 在 GitHub 创建新仓库（访问 https://github.com/new）

# 添加远程仓库
git remote add origin https://github.com/your-username/your-repo.git

# 推送代码
git branch -M main
git push -u origin main
```

### 步骤 3: 在 Vercel 部署

1. 访问 [Vercel 部署页面](https://vercel.com/new)
2. 点击 "Import" 导入你的 GitHub 仓库
3. 配置项目信息：
   - **Project Name**: 输入项目名称
   - **Framework**: 选择 "Next.js"
   - **Root Directory**: 保持 `./`
4. 点击 "Deploy" 等待部署完成

大约 1-2 分钟后，你的网站就上线了！🎉

## 📝 配置环境变量（可选）

部署完成后，在 Vercel 项目设置中添加环境变量：

1. 进入项目 → Settings → Environment Variables
2. 添加以下变量：

```
NEXT_PUBLIC_APP_URL=https://your-project.vercel.app
NEXT_PUBLIC_APP_NAME=Passive Edge 订单生产测试管理系统
NODE_ENV=production
```

3. 重新部署项目使配置生效

## 🌐 自定义域名（可选）

如果你有自己的域名：

1. 进入项目 → Settings → Domains
2. 添加你的域名（如 `app.yourdomain.com`）
3. 按照提示配置 DNS 记录：
   ```
   类型: CNAME
   名称: app
   值: cname.vercel-dns.com
   ```

## 🔧 常见问题

### Q: 部署失败怎么办？
A: 检查以下几点：
- Node.js 版本是否 >= 18
- 依赖是否正确安装
- 代码是否有类型错误
- 查看部署日志获取详细错误信息

### Q: 如何更新网站？
A: 只需推送代码到主分支，Vercel 会自动重新部署：

```bash
git add .
git commit -m "Update website"
git push
```

### Q: 免费额度够用吗？
A: Vercel 免费版提供：
- 每月 100GB 带宽
- 无限次部署
- 自动 HTTPS
- 全球 CDN

对于中小型项目完全够用。

### Q: 需要配置数据库吗？
A:
- **演示版本**：使用模拟数据，无需数据库
- **生产环境**：需要配置 PostgreSQL 数据库

推荐使用 [Supabase](https://supabase.com)（免费）或 [Neon](https://neon.tech)（免费）

## 📚 下一步

部署完成后，你可以：

1. **浏览系统**：访问你的网站地址
2. **测试功能**：尝试创建订单、配方等
3. **配置数据库**：将模拟数据替换为真实数据库
4. **自定义样式**：修改主题颜色、Logo 等
5. **添加功能**：根据业务需求扩展功能

## 🆘 获取帮助

遇到问题？查看详细文档：

- [完整部署指南](./DEPLOYMENT.md) - 各种部署方式的详细说明
- [部署验证清单](./DEPLOYMENT_CHECKLIST.md) - 确保部署成功
- [项目 README](./README.md) - 项目完整介绍

## 🎯 快速链接

- [Vercel 控制台](https://vercel.com/dashboard)
- [Next.js 文档](https://nextjs.org/docs)
- [shadcn/ui 文档](https://ui.shadcn.com)

---

**恭喜！你的系统已成功部署！** 🎊

现在可以开始使用 Passive Edge 订单生产测试管理系统了。
