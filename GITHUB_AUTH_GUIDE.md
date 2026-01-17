# GitHub 认证问题解决方案

## 问题说明
错误信息：`Invalid username or token. Password authentication is not supported for Git operations.`

GitHub 已不再支持密码认证，需要使用个人访问令牌（Personal Access Token, PAT）或 SSH 密钥。

---

## 解决方案

### 方案1：使用 Personal Access Token (PAT)

#### 步骤1：创建 Personal Access Token

1. 登录 GitHub
2. 点击右上角头像 → Settings（设置）
3. 左侧菜单最下方 → Developer settings
4. 点击 Personal access tokens → Tokens (classic)
5. 点击 "Generate new token (classic)"
6. 填写：
   - Note: 输入一个描述，如 "Passive Edge 项目"
   - Expiration: 选择过期时间（建议选择 90 days 或 No expiration）
7. 勾选权限：
   - ✅ repo (完整的仓库访问权限)
   - ✅ workflow (如果需要 GitHub Actions)
8. 点击底部的 "Generate token"
9. **重要：立即复制生成的 token（以 `ghp_` 开头），页面关闭后将无法再看到！**

#### 步骤2：使用 Token 推送代码

```bash
# 方式1：使用 git credential helper（推荐，只需输入一次）
git config --global credential.helper store

# 推送时会提示输入用户名和密码
# 用户名：你的 GitHub 用户名
# 密码：刚刚复制的 Personal Access Token

git push -u origin main
```

或

```bash
# 方式2：在 URL 中包含 token
git remote set-url origin https://你的用户名:你的token@github.com/coreyuab-beep/pe.git

git push -u origin main
```

**注意**：方式2 会将 token 保存到 git 配置中，有一定安全风险，仅供测试使用。

---

### 方案2：使用 SSH 密钥（更安全，推荐长期使用）

#### 步骤1：生成 SSH 密钥

```bash
# 生成新的 SSH 密钥（使用 ed25519 算法）
ssh-keygen -t ed25519 -C "你的邮箱@example.com"

# 或者使用 RSA 算法（如果 ed25519 不支持）
ssh-keygen -t rsa -b 4096 -C "你的邮箱@example.com"
```

按提示操作：
- Enter file in which to save the key: 直接回车（使用默认路径）
- Enter passphrase: 可以输入密码（可选，也可以直接回车）
- Enter same passphrase again: 再次输入密码（或直接回车）

#### 步骤2：添加 SSH 密钥到 ssh-agent

```bash
# 启动 ssh-agent
eval "$(ssh-agent -s)"

# 添加私钥
ssh-add ~/.ssh/id_ed25519

# 如果使用 RSA 密钥
ssh-add ~/.ssh/id_rsa
```

#### 步骤3：添加 SSH 公钥到 GitHub

1. 复制公钥内容：
```bash
cat ~/.ssh/id_ed25519.pub

# 或使用 RSA
cat ~/.ssh/id_rsa.pub
```

2. 在 GitHub 添加公钥：
   - 登录 GitHub
   - 点击右上角头像 → Settings
   - 左侧菜单 → SSH and GPG keys
   - 点击 "New SSH key"
   - Title: 输入一个描述，如 "Passive Edge SSH Key"
   - Key type: 选择 "Authentication Key"
   - Key: 粘贴刚才复制的公钥内容
   - 点击 "Add SSH key"

#### 步骤4：修改远程仓库地址为 SSH

```bash
# 将远程仓库 URL 改为 SSH 格式
git remote set-url origin git@github.com:coreyuab-beep/pe.git

# 测试连接
ssh -T git@github.com

# 如果看到 "Hi coreyuab-beep! You've successfully authenticated" 表示成功

# 推送代码
git push -u origin main
```

---

## 方案3：使用 GitHub CLI (gh)

如果你有 GitHub CLI 工具：

```bash
# 安装 GitHub CLI（如果没有）
# macOS: brew install gh
# Linux: sudo apt install gh
# Windows: 从 https://cli.github.com/ 下载安装

# 登录 GitHub
gh auth login

# 按提示选择：
# 1. GitHub.com
# 2. HTTPS
# 3. Login with a web browser

# 推送代码
git push -u origin main
```

---

## 推荐方案

| 场景 | 推荐方案 |
|------|---------|
| 快速测试、临时使用 | Personal Access Token |
| 长期开发、多人协作 | SSH 密钥 |
| 偏好命令行工具 | GitHub CLI (gh) |

---

## 常见问题

### Q: Token 或 SSH 密钥在哪里保存？
A:
- Token 会被保存在 `~/.git-credentials` 文件中
- SSH 密钥保存在 `~/.ssh/` 目录中

### Q: 如何撤销 Token？
A:
1. GitHub → Settings → Developer settings
2. Personal access tokens → Tokens (classic)
3. 找到对应的 token → 点击 "Delete"

### Q: 如何删除 SSH 密钥？
A:
1. GitHub → Settings → SSH and GPG keys
2. 找到对应的密钥 → 点击 "Delete"

### Q: 忘记了 Token 怎么办？
A:
- Token 只在创建时显示一次，忘记后需要重新创建
- 删除旧 token，按照步骤1创建新的 token

---

## 安全建议

1. ✅ 不要将 Token 提交到代码仓库
2. ✅ 不要在公开场合分享 Token
3. ✅ 定期更换 Token（设置合理的过期时间）
4. ✅ 使用 SSH 密钥进行长期开发
5. ✅ 为 SSH 密钥设置密码短语（passphrase）
