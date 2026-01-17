#!/bin/bash

# Passive Edge - Vercel 部署脚本
# 用于快速部署到 Vercel 平台

set -e

echo "🚀 Passive Edge 订单生产测试管理系统 - Vercel 部署助手"
echo "================================================================"
echo ""

# 颜色定义
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 检查必要工具
echo -e "${YELLOW}检查环境...${NC}"

if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js 未安装${NC}"
    echo "请访问 https://nodejs.org/ 下载安装"
    exit 1
fi

if ! command -v pnpm &> /dev/null; then
    echo -e "${RED}❌ pnpm 未安装${NC}"
    echo "运行: npm install -g pnpm"
    exit 1
fi

if ! command -v git &> /dev/null; then
    echo -e "${RED}❌ Git 未安装${NC}"
    echo "请先安装 Git"
    exit 1
fi

echo -e "${GREEN}✅ 环境检查通过${NC}"
echo ""

# 安装依赖
echo -e "${YELLOW}安装项目依赖...${NC}"
pnpm install
echo -e "${GREEN}✅ 依赖安装完成${NC}"
echo ""

# 运行类型检查
echo -e "${YELLOW}运行类型检查...${NC}"
pnpm run ts-check
echo -e "${GREEN}✅ 类型检查通过${NC}"
echo ""

# 构建项目
echo -e "${YELLOW}构建项目...${NC}"
pnpm run build
echo -e "${GREEN}✅ 项目构建成功${NC}"
echo ""

# 检查 Git 仓库
if [ ! -d ".git" ]; then
    echo -e "${YELLOW}初始化 Git 仓库...${NC}"
    git init
    git add .
    git commit -m "Initial commit"
    echo -e "${GREEN}✅ Git 仓库已初始化${NC}"
    echo ""
    
    echo -e "${YELLOW}请按照以下步骤操作：${NC}"
    echo "1. 在 GitHub 创建新仓库"
    echo "2. 运行以下命令："
    echo "   git remote add origin https://github.com/your-username/your-repo.git"
    echo "   git branch -M main"
    echo "   git push -u origin main"
    echo ""
    echo "3. 访问 https://vercel.com/new 导入你的仓库"
    echo ""
else
    echo -e "${GREEN}✅ Git 仓库已存在${NC}"
    echo ""
    echo -e "${YELLOW}后续步骤：${NC}"
    echo "1. 确保代码已推送到远程仓库"
    echo "2. 访问 https://vercel.com/new 导入你的仓库"
    echo "3. 在 Vercel 项目设置中配置环境变量"
    echo ""
fi

# 环境变量提醒
echo -e "${YELLOW}需要配置的环境变量：${NC}"
echo "- NEXT_PUBLIC_APP_URL=https://your-domain.com"
echo "- NEXT_PUBLIC_APP_NAME=Passive Edge 订单生产测试管理系统"
echo "- NODE_ENV=production"
echo ""
echo -e "${YELLOW}如需使用数据库：${NC}"
echo "- DATABASE_URL=postgresql://user:password@host:5432/database"
echo ""

echo -e "${GREEN}========================================================${NC}"
echo -e "${GREEN}🎉 部署准备完成！${NC}"
echo -e "${GREEN}========================================================${NC}"
echo ""
echo -e "📚 详细部署文档请查看: DEPLOYMENT.md"
echo ""
