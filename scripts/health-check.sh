#!/bin/bash

# Vercel 部署健康检查脚本
# 用途: 验证 Vercel 部署的应用是否正常运行

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 配置
APP_URL="${1:-http://localhost:5000}"
TIMEOUT=30

echo "======================================"
echo "Vercel 部署健康检查"
echo "======================================"
echo "目标 URL: $APP_URL"
echo "超时时间: ${TIMEOUT}s"
echo "======================================"
echo ""

# 检查函数
check_endpoint() {
    local name="$1"
    local url="$2"
    local expected_status="${3:-200}"
    
    echo -n "检查 $name ... "
    
    response=$(curl -s -o /dev/null -w "%{http_code}" --max-time $TIMEOUT "$url" 2>&1 || echo "000")
    
    if [ "$response" = "$expected_status" ]; then
        echo -e "${GREEN}✓ 通过${NC} (HTTP $response)"
        return 0
    else
        echo -e "${RED}✗ 失败${NC} (HTTP $response, 预期 $expected_status)"
        return 1
    fi
}

# 检查响应时间
check_response_time() {
    local name="$1"
    local url="$2"
    local max_time="${3:-2000}"
    
    echo -n "检查 $name 响应时间 ... "
    
    start_time=$(date +%s%3N)
    curl -s -o /dev/null --max-time $TIMEOUT "$url" > /dev/null 2>&1
    end_time=$(date +%s%3N)
    
    response_time=$((end_time - start_time))
    
    if [ $response_time -le $max_time ]; then
        echo -e "${GREEN}✓ 通过${NC} (${response_time}ms)"
        return 0
    else
        echo -e "${YELLOW}⚠ 警告${NC} (${response_time}ms, 预期 ≤${max_time}ms)"
        return 1
    fi
}

# 检查 JSON 响应
check_json_response() {
    local name="$1"
    local url="$2"
    local field="$3"
    
    echo -n "检查 $name JSON 响应 ... "
    
    response=$(curl -s --max-time $TIMEOUT "$url" 2>&1)
    
    if echo "$response" | jq -e ".$field" > /dev/null 2>&1; then
        echo -e "${GREEN}✓ 通过${NC}"
        return 0
    else
        echo -e "${RED}✗ 失败${NC} (无效的 JSON 响应)"
        echo "响应内容: $response"
        return 1
    fi
}

# 主检查流程
main_checks=0
main_passed=0
main_failed=0

echo "1. 基础连接检查"
echo "-------------------"

if check_endpoint "主页" "$APP_URL/" "200"; then
    ((main_passed++))
else
    ((main_failed++))
fi
((main_checks++))

if check_endpoint "登录页面" "$APP_URL/login" "200"; then
    ((main_passed++))
else
    ((main_failed++))
fi
((main_checks++))

echo ""
echo "2. API 路由检查"
echo "-------------------"

# 注意: 这些检查可能需要认证，如果是公开 API 则会通过
if check_endpoint "登录 API" "$APP_URL/api/auth/login" "405"; then
    ((main_passed++))
else
    ((main_failed++))
fi
((main_checks++))

if check_endpoint "修改密码 API" "$APP_URL/api/auth/update-password" "405"; then
    ((main_passed++))
else
    ((main_failed++))
fi
((main_checks++))

echo ""
echo "3. 性能检查"
echo "-------------------"

if check_response_time "主页响应时间" "$APP_URL/" "2000"; then
    ((main_passed++))
else
    ((main_failed++))
fi
((main_checks++))

if check_response_time "登录页面响应时间" "$APP_URL/login" "2000"; then
    ((main_passed++))
else
    ((main_failed++))
fi
((main_checks++))

echo ""
echo "4. 安全头检查"
echo "-------------------"

check_security_header() {
    local url="$1"
    local header="$2"
    
    echo -n "检查安全头 $header ... "
    
    response=$(curl -s -I --max-time $TIMEOUT "$url" 2>&1)
    
    if echo "$response" | grep -qi "$header"; then
        echo -e "${GREEN}✓ 通过${NC}"
        return 0
    else
        echo -e "${YELLOW}⚠ 缺失${NC}"
        return 1
    fi
}

if check_security_header "$APP_URL/" "X-Content-Type-Options"; then
    ((main_passed++))
else
    ((main_failed++))
fi
((main_checks++))

if check_security_header "$APP_URL/" "X-Frame-Options"; then
    ((main_passed++))
else
    ((main_failed++))
fi
((main_checks++))

if check_security_header "$APP_URL/" "X-XSS-Protection"; then
    ((main_passed++))
else
    ((main_failed++))
fi
((main_checks++))

echo ""
echo "======================================"
echo "检查结果汇总"
echo "======================================"
echo "总检查数: $main_checks"
echo -e "通过: ${GREEN}$main_passed${NC}"
echo -e "失败: ${RED}$main_failed${NC}"
echo "======================================"

# 退出码
if [ $main_failed -eq 0 ]; then
    echo -e "${GREEN}✓ 所有检查通过！部署正常。${NC}"
    exit 0
else
    echo -e "${RED}✗ 部分检查失败，请检查配置。${NC}"
    exit 1
fi
