#!/bin/bash

# Vercel 部署认证诊断脚本

APP_URL="${1:-http://localhost:5000}"

echo "======================================"
echo "认证系统诊断工具"
echo "======================================"
echo "目标 URL: $APP_URL"
echo ""

# 1. 测试登录 API
echo "1. 测试登录 API"
echo "-------------------"
echo "尝试使用默认账号登录..."
echo "用户名: admin"
echo "密码: admin123"
echo ""

response=$(curl -s -X POST "$APP_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}' 2>&1)

echo "响应: $response"
echo ""

# 2. 检查响应状态
echo "2. 检查响应状态"
echo "-------------------"
status_code=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$APP_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}' 2>&1)

echo "HTTP 状态码: $status_code"
echo ""

if [ "$status_code" = "200" ]; then
    echo "✅ 登录 API 正常工作"
elif [ "$status_code" = "401" ]; then
    echo "❌ 认证失败 - 可能原因："
    echo "   - 用户名或密码错误"
    echo "   - 用户数据未初始化"
    echo "   - 密码编码方式不匹配"
elif [ "$status_code" = "500" ]; then
    echo "❌ 服务器错误 - 可能原因："
    echo "   - API 路由配置问题"
    echo "   - 代码错误"
    echo "   - 环境变量缺失"
else
    echo "⚠️  未知状态码: $status_code"
fi

echo ""

# 3. 检查环境变量
echo "3. 检查本地环境变量（仅本地环境）"
echo "-------------------"
if [ -f ".env" ]; then
    echo "✅ .env 文件存在"
    echo ""
    echo "ADMIN_USERNAME: ${ADMIN_USERNAME:-未设置}"
    echo "ADMIN_PASSWORD: ${ADMIN_PASSWORD:-未设置}"
else
    echo "⚠️  .env 文件不存在（生产环境正常）"
fi

echo ""

# 4. 提供解决方案
echo "4. 常见问题解决方案"
echo "-------------------"
echo ""
echo "如果无法登录，请尝试以下步骤："
echo ""
echo "方案 1: 清除浏览器缓存"
echo "  - 打开浏览器开发者工具 (F12)"
echo "  - 右键点击刷新按钮"
echo "  - 选择'清空缓存并硬性重新加载'"
echo ""
echo "方案 2: 检查浏览器控制台"
echo "  - 打开浏览器开发者工具 (F12)"
echo "  - 查看 Console 标签页的错误信息"
echo "  - 查看 Network 标签页的请求详情"
echo ""
echo "方案 3: 检查 Vercel 部署日志"
echo "  - 访问 Vercel Dashboard"
echo "  - 进入项目 → Deployments"
echo "  - 查看最新的部署日志"
echo ""
echo "方案 4: 重新部署"
echo "  - 在 Vercel Dashboard 中点击'Redeploy'"
echo "  - 确保所有环境变量已正确配置"
echo ""

echo "======================================"
echo "诊断完成"
echo "======================================"
