# 云端部署文件说明

本目录包含完整的云端部署配置文件和文档。

## 📁 文件列表

### 配置文件

1. **vercel.json** - Vercel 平台配置
   - 定义构建命令
   - 配置输出目录
   - 设置安全响应头
   - 配置部署区域

2. **.env.example** - 环境变量模板
   - 数据库配置示例
   - 对象存储配置示例
   - 应用配置示例
   - ⚠️ 不包含真实密钥

### 部署脚本

3. **deploy-vercel.sh** - Vercel 一键部署脚本
   - 环境检查
   - 自动安装依赖
   - 类型检查
   - 项目构建
   - Git 仓库初始化

### 文档

4. **QUICK_START.md** - 快速开始指南（⭐ 推荐首先阅读）
   - 3 步完成部署
   - 常见问题解答
   - 适合新手

5. **DEPLOYMENT.md** - 完整部署指南
   - 3 种部署方式详解
   - Vercel 部署步骤
   - Docker 部署配置
   - 云服务器部署指南
   - 数据库配置
   - 域名配置
   - 安全建议

6. **DEPLOYMENT_CHECKLIST.md** - 部署验证清单
   - 代码准备检查
   - 环境变量检查
   - 功能测试检查
   - 安全检查
   - 性能优化检查
   - 部署验证命令

## 🚀 快速开始

### 第一步：阅读快速指南

```bash
cat QUICK_START.md
```

### 第二步：运行部署脚本

```bash
./deploy-vercel.sh
```

### 第三步：推送到 GitHub 并在 Vercel 部署

详细步骤请查看 [QUICK_START.md](./QUICK_START.md)

## 📖 详细文档

### 按需查看文档

| 场景 | 推荐文档 |
|------|---------|
| 第一次部署 | [QUICK_START.md](./QUICK_START.md) |
| Vercel 部署 | [DEPLOYMENT.md](./DEPLOYMENT.md#方式一vercel-部署推荐) |
| Docker 部署 | [DEPLOYMENT.md](./DEPLOYMENT.md#方式二docker-部署) |
| 云服务器部署 | [DEPLOYMENT.md](./DEPLOYMENT.md#方式三云服务器部署) |
| 部署前检查 | [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md) |
| 配置数据库 | [DEPLOYMENT.md](./DEPLOYMENT.md#数据库配置) |
| 配置域名 | [DEPLOYMENT.md](./DEPLOYMENT.md#域名配置) |

## 🛠️ 部署方式对比

| 部署方式 | 文档链接 | 难度 | 成本 | 适用场景 |
|---------|---------|------|------|---------|
| **Vercel** | [快速指南](./QUICK_START.md) | ⭐ 简单 | 免费额度 | 快速上线、中小企业 |
| **Docker** | [Docker 部署](./DEPLOYMENT.md#方式二docker-部署) | ⭐⭐ 中等 | 服务器费用 | 容器化、云服务器 |
| **云服务器** | [服务器部署](./DEPLOYMENT.md#方式三云服务器部署) | ⭐⭐⭐ 较难 | 服务器费用 | 企业级应用 |

## 📝 环境变量配置

参考 [.env.example](../.env.example) 配置环境变量：

```bash
# 复制示例文件
cp .env.example .env.local

# 编辑配置
nano .env.local
```

## 🔐 安全注意事项

1. **不要提交敏感信息**
   - `.env` 文件已在 `.gitignore` 中
   - 只提交 `.env.example`

2. **使用环境变量**
   - 密钥、密码等敏感信息必须使用环境变量
   - 不要硬编码在代码中

3. **配置 HTTPS**
   - Vercel 自动提供 HTTPS
   - 云服务器需配置 SSL 证书

4. **定期更新依赖**
   ```bash
   pnpm update
   ```

## 🆘 常见问题

### 部署失败

查看 [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md) 中的故障排查部分。

### 环境变量配置

参考 [DEPLOYMENT.md](./DEPLOYMENT.md#环境变量配置) 中的详细说明。

### 数据库配置

查看 [DEPLOYMENT.md](./DEPLOYMENT.md#数据库配置) 的数据库配置部分。

## 📞 获取帮助

- **文档**：[DEPLOYMENT.md](./DEPLOYMENT.md)
- **快速开始**：[QUICK_START.md](./QUICK_START.md)
- **检查清单**：[DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)
- **项目 README**：[README.md](../README.md)

## 🎯 部署流程图

```
开始
  ↓
阅读 QUICK_START.md
  ↓
运行 deploy-vercel.sh
  ↓
推送代码到 GitHub
  ↓
在 Vercel 导入仓库
  ↓
配置环境变量
  ↓
部署完成！✅
```

---

**提示**：如果是第一次部署，建议从 [QUICK_START.md](./QUICK_START.md) 开始。
