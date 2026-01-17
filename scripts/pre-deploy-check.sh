#!/bin/bash

# 部署前本地验证脚本
# 用途: 在部署到 Vercel 前验证本地配置

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "======================================"
echo "部署前本地验证"
echo "======================================"
echo ""

checks=0
passed=0
failed=0

# 1. 检查必需文件
echo "1. 检查必需文件"
echo "-------------------"

required_files=(
    "package.json"
    "tsconfig.json"
    "next.config.ts"
    ".env.example"
    "vercel.json"
    "src/app/layout.tsx"
    "src/app/page.tsx"
)

for file in "${required_files[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✓${NC} $file"
        ((passed++))
    else
        echo -e "${RED}✗${NC} $file (缺失)"
        ((failed++))
    fi
    ((checks++))
done

echo ""

# 2. 检查环境变量示例
echo "2. 检查环境变量配置"
echo "-------------------"

if [ -f ".env.example" ]; then
    env_vars=(
        "DATABASE_URL"
        "AWS_ACCESS_KEY_ID"
        "AWS_SECRET_ACCESS_KEY"
        "AWS_REGION"
        "AWS_S3_BUCKET"
        "NEXT_PUBLIC_APP_URL"
        "NEXT_PUBLIC_APP_NAME"
        "NODE_ENV"
        "ADMIN_USERNAME"
        "ADMIN_PASSWORD"
    )
    
    for var in "${env_vars[@]}"; do
        if grep -q "^${var}=" .env.example; then
            echo -e "${GREEN}✓${NC} $var 已定义"
            ((passed++))
        else
            echo -e "${YELLOW}⚠${NC} $var 未定义"
            ((failed++))
        fi
        ((checks++))
    done
else
    echo -e "${RED}✗${NC} .env.example 文件缺失"
    ((failed++))
    ((checks++))
fi

echo ""

# 3. 检查 Node.js 版本
echo "3. 检查 Node.js 版本"
echo "-------------------"

if command -v node &> /dev/null; then
    node_version=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$node_version" -ge 18 ]; then
        echo -e "${GREEN}✓${NC} Node.js 版本: $(node -v) (符合要求 ≥18)"
        ((passed++))
    else
        echo -e "${RED}✗${NC} Node.js 版本: $(node -v) (需要 ≥18)"
        ((failed++))
    fi
else
    echo -e "${RED}✗${NC} Node.js 未安装"
    ((failed++))
fi
((checks++))

# 4. 检查 pnpm 版本
echo ""
echo "4. 检查 pnpm 版本"
echo "-------------------"

if command -v pnpm &> /dev/null; then
    pnpm_version=$(pnpm -v | cut -d'.' -f1)
    if [ "$pnpm_version" -ge 9 ]; then
        echo -e "${GREEN}✓${NC} pnpm 版本: $(pnpm -v) (符合要求 ≥9)"
        ((passed++))
    else
        echo -e "${RED}✗${NC} pnpm 版本: $(pnpm -v) (需要 ≥9)"
        ((failed++))
    fi
else
    echo -e "${RED}✗${NC} pnpm 未安装"
    ((failed++))
fi
((checks++))

# 5. 检查 Git 配置
echo ""
echo "5. 检查 Git 配置"
echo "-------------------"

if command -v git &> /dev/null; then
    if git remote -v | grep -q "origin"; then
        echo -e "${GREEN}✓${NC} Git 远程仓库已配置"
        git remote -v | grep "origin" | head -1
        ((passed++))
    else
        echo -e "${YELLOW}⚠${NC} Git 远程仓库未配置"
        ((failed++))
    fi
else
    echo -e "${RED}✗${NC} Git 未安装"
    ((failed++))
fi
((checks++))

# 6. 检查 node_modules
echo ""
echo "6. 检查依赖安装"
echo "-------------------"

if [ -d "node_modules" ]; then
    echo -e "${GREEN}✓${NC} node_modules 目录存在"
    ((passed++))
else
    echo -e "${YELLOW}⚠${NC} node_modules 目录不存在 (需要运行 pnpm install)"
    ((failed++))
fi
((checks++))

# 7. 检查构建配置
echo ""
echo "7. 检查构建配置"
echo "-------------------"

if [ -f "package.json" ]; then
    if grep -q '"build"' package.json && grep -q '"dev"' package.json; then
        echo -e "${GREEN}✓${NC} 构建脚本已配置"
        ((passed++))
    else
        echo -e "${RED}✗${NC} 构建脚本缺失"
        ((failed++))
    fi
else
    echo -e "${RED}✗${NC} package.json 文件缺失"
    ((failed++))
fi
((checks++))

# 8. 检查 TypeScript 配置
echo ""
echo "8. 检查 TypeScript 配置"
echo "-------------------"

if [ -f "tsconfig.json" ]; then
    echo -e "${GREEN}✓${NC} tsconfig.json 文件存在"
    ((passed++))
else
    echo -e "${RED}✗${NC} tsconfig.json 文件缺失"
    ((failed++))
fi
((checks++))

# 9. 检查 Vercel 配置
echo ""
echo "9. 检查 Vercel 配置"
echo "-------------------"

if [ -f "vercel.json" ]; then
    echo -e "${GREEN}✓${NC} vercel.json 文件存在"
    
    # 检查必需字段
    required_fields=(
        "buildCommand"
        "outputDirectory"
        "framework"
    )
    
    for field in "${required_fields[@]}"; do
        if grep -q "\"$field\"" vercel.json; then
            echo -e "  ${GREEN}✓${NC} $field 字段已配置"
            ((passed++))
        else
            echo -e "  ${RED}✗${NC} $field 字段缺失"
            ((failed++))
        fi
        ((checks++))
    done
else
    echo -e "${RED}✗${NC} vercel.json 文件缺失"
    ((failed++))
    ((checks+=3))
fi

# 10. 检查 .gitignore
echo ""
echo "10. 检查 .gitignore 配置"
echo "-------------------"

if [ -f ".gitignore" ]; then
    echo -e "${GREEN}✓${NC} .gitignore 文件存在"
    
    ignored_items=(
        ".env"
        "node_modules"
        ".next"
    )
    
    for item in "${ignored_items[@]}"; do
        if grep -q "$item" .gitignore; then
            echo -e "  ${GREEN}✓${NC} $item 已忽略"
            ((passed++))
        else
            echo -e "  ${YELLOW}⚠${NC} $item 未忽略"
            ((failed++))
        fi
        ((checks++))
    done
else
    echo -e "${YELLOW}⚠${NC} .gitignore 文件缺失"
    ((failed++))
    ((checks+=3))
fi

echo ""
echo "======================================"
echo "验证结果汇总"
echo "======================================"
echo "总检查数: $checks"
echo -e "通过: ${GREEN}$passed${NC}"
echo -e "失败: ${RED}$failed${NC}"
echo "======================================"

# 退出码
if [ $failed -eq 0 ]; then
    echo -e "${GREEN}✓ 所有检查通过！可以进行部署。${NC}"
    echo ""
    echo "下一步操作:"
    echo "1. 确保环境变量已在 Vercel 中配置"
    echo "2. 推送代码到 GitHub: git push"
    echo "3. 在 Vercel 中触发部署"
    exit 0
else
    echo -e "${RED}✗ 部分检查失败，请修复问题后再部署。${NC}"
    exit 1
fi
