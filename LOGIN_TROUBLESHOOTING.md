# 登录问题解决方案

## 默认账户信息

- **用户名**: `admin`
- **密码**: `admin123`

## 如果无法登录，请按以下步骤操作

### 步骤 1: 清除浏览器缓存

1. 打开浏览器开发者工具（按 F12）
2. 右键点击刷新按钮
3. 选择"清空缓存并硬性重新加载"

### 步骤 2: 使用调试 API 验证

访问以下 URL 验证用户数据是否正确初始化：

```
https://your-domain.vercel.app/api/auth/debug
```

预期返回：
```json
{
  "user": {
    "id": "admin-001",
    "username": "admin",
    "role": "admin",
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  "passwordHash": "YWRtaW4xMjM=",
  "testPassword": "admin123",
  "testHash": "YWRtaW4xMjM="
}
```

### 步骤 3: 测试登录 API

使用以下 curl 命令测试登录 API：

```bash
curl -X POST https://your-domain.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

预期返回：
```json
{
  "success": true,
  "user": {
    "id": "admin-001",
    "username": "admin",
    "role": "admin",
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  "message": "登录成功"
}
```

### 步骤 4: 重置用户数据

如果以上步骤都无法解决问题，使用重置 API：

```bash
curl -X POST https://your-domain.vercel.app/api/auth/reset
```

预期返回：
```json
{
  "success": true,
  "message": "用户数据已重置为默认值",
  "defaultUsername": "admin",
  "defaultPassword": "admin123",
  "passwordHash": "YWRtaW4xMjM="
}
```

### 步骤 5: 重新部署

如果问题仍然存在：

1. 访问 Vercel Dashboard
2. 进入项目 → Deployments
3. 点击最新部署旁边的 "..." 菜单
4. 选择 "Redeploy"
5. 等待部署完成
6. 重复步骤 2-4

### 步骤 6: 检查浏览器控制台

1. 打开浏览器开发者工具（按 F12）
2. 查看 Console 标签页
3. 查看是否有错误信息
4. 查看 Network 标签页
5. 尝试登录，查看 `/api/auth/login` 请求的详细信息

### 步骤 7: 检查 Vercel 部署日志

1. 访问 Vercel Dashboard
2. 进入项目 → Deployments
3. 点击最新的部署
4. 查看 **Build Logs** 和 **Function Logs**
5. 查找错误信息

## 常见错误及解决方案

### 错误 1: "Internal Server Error"

**原因**: 服务器端代码错误

**解决方案**:
1. 使用调试 API 验证用户数据
2. 查看浏览器控制台的错误信息
3. 检查 Vercel 部署日志
4. 重新部署项目

### 错误 2: "用户名或密码错误"

**原因**: 用户数据未正确初始化或密码不匹配

**解决方案**:
1. 使用重置 API 重置用户数据
2. 确认输入的用户名和密码正确（区分大小写）
3. 清除浏览器缓存

### 错误 3: "Network Error"

**原因**: 网络连接问题或 API 路由未正确部署

**解决方案**:
1. 检查网络连接
2. 确认 Vercel 部署成功
3. 查看浏览器 Network 标签页的请求详情
4. 重新部署项目

### 错误 4: Cookie 未设置

**原因**: 浏览器阻止 Cookie 或响应头问题

**解决方案**:
1. 检查浏览器的 Cookie 设置
2. 确认浏览器未阻止第三方 Cookie
3. 查看浏览器 Application 标签页的 Cookie 信息
4. 尝试使用其他浏览器

## 使用诊断脚本

本地环境中，可以使用诊断脚本：

```bash
# 诊断本地环境
bash scripts/check-auth.sh http://localhost:5000

# 诊断 Vercel 环境
bash scripts/check-auth.sh https://your-domain.vercel.app
```

## 获取帮助

如果以上步骤都无法解决问题：

1. 查看浏览器控制台的完整错误信息
2. 查看 Vercel 部署日志
3. 尝试使用不同的浏览器
4. 联系技术支持

## 安全提示

⚠️ **重要提示**:

1. **首次登录后立即修改默认密码**
   - 登录系统
   - 进入"系统设置"
   - 修改密码

2. **生产环境移除调试 API**
   - `/api/auth/debug` 和 `/api/auth/reset` 仅用于调试
   - 生产环境建议移除这些路由或添加访问控制

3. **使用强密码**
   - 密码至少 6 位
   - 包含字母、数字和特殊字符
   - 定期更换密码

## 相关文档

- [Vercel 故障排查](./VERCEL_TROUBLESHOOTING.md)
- [认证系统指南](./AUTH_GUIDE.md)
- [API 路由文档](./API_DOCUMENTATION.md)

---

**最后更新**: 2025-01-17
