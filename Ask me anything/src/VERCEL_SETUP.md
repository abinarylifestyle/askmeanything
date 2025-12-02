# 🚀 Vercel 部署完整指南

## 🔧 修复 404 错误

如果你已经部署但看到 404 错误，按照以下步骤操作：

### 步骤 1：更新代码

1. 从 Figma 重新下载最新代码（我已经修复了 `vercel.json`）
2. 或者手动更新你的 `vercel.json` 文件为：

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### 步骤 2：推送更新到 GitHub

```bash
# 在项目文件夹中打开终端

# 添加所有文件
git add .

# 提交更改
git commit -m "Fix Vercel 404 error"

# 推送到 GitHub
git push
```

**Vercel 会自动检测到更新并重新部署！**

### 步骤 3：等待重新部署

1. 访问 https://vercel.com/dashboard
2. 点击你的项目
3. 查看 **Deployments** 标签
4. 等待新的部署完成（通常 1-2 分钟）
5. 🎉 再次访问你的网址，应该就能正常显示了！

---

## 🆕 如果是首次部署

### 完整部署步骤

#### 1️⃣ 准备代码

```bash
# 下载代码后，在文件夹中打开终端

# 初始化 Git
git init

# 添加所有文件
git add .

# 第一次提交
git commit -m "Initial commit: Ask Me Anything"
```

#### 2️⃣ 上传到 GitHub

1. 访问 https://github.com/new
2. 创建新仓库，例如：`ask-me-anything`
3. **不要**勾选任何选项（README、.gitignore 等）
4. 创建后运行：

```bash
# 替换成你的用户名和仓库名
git remote add origin https://github.com/你的用户名/ask-me-anything.git
git branch -M main
git push -u origin main
```

#### 3️⃣ 在 Vercel 中配置

1. 访问 https://vercel.com
2. 点击 **Sign Up**（用 GitHub 登录）
3. 点击 **Add New** → **Project**
4. 选择你的 GitHub 仓库

#### 4️⃣ 配置构建设置（重要！）

在 Vercel 的配置页面：

**Framework Preset**: Vite

**Build Command**:
```
npm run build
```

**Output Directory**:
```
dist
```

**Install Command**:
```
npm install
```

**Root Directory**: 
```
./
```

⚠️ **不要修改其他设置！**

#### 5️⃣ 部署

点击 **Deploy** 按钮，等待 2-3 分钟。

---

## ✅ 验证部署成功

部署完成后，你应该能看到：

1. ✅ Vercel 显示 "Ready" 状态
2. ✅ 点击预览链接能打开应用
3. ✅ 看到黑色主题和 "🎭 Ask Me Anything" 标题
4. ✅ 顶部显示绿色提示：「已连接到 Supabase 真实数据库」

---

## 🔍 常见问题排查

### 问题 1：仍然显示 404

**检查清单**：

1. **检查 `vercel.json` 文件**
   - 确保文件存在于项目根目录
   - 内容正确（见上面的配置）

2. **检查 Vercel 构建日志**
   - 在 Vercel Dashboard 点击你的项目
   - 点击最新的 Deployment
   - 查看 **Build Logs**
   - 是否有错误？

3. **检查构建输出**
   - 在 Build Logs 中搜索 "dist"
   - 应该看到文件被输出到 `dist` 目录

4. **强制重新部署**
   - 在 Vercel Dashboard
   - 点击项目 → Deployments
   - 点击最新部署右侧的 ⋯ 菜单
   - 选择 **Redeploy**

### 问题 2：构建失败

**可能原因**：
- `package.json` 缺失或错误
- Node.js 版本不兼容

**解决方法**：
1. 确保项目根目录有 `package.json`
2. 在 Vercel 项目设置中：
   - Settings → General → Node.js Version
   - 选择 `18.x` 或 `20.x`

### 问题 3：页面空白但没有 404

**解决方法**：
1. 打开浏览器开发者工具（F12）
2. 查看 Console 标签是否有错误
3. 检查是否是 Supabase 连接问题
4. 确认已在 Supabase 中运行 `SETUP_DATABASE.sql`

### 问题 4：显示"Figma 预览模式"

这个不应该发生在 Vercel 部署上。如果出现：

1. 检查域名是否包含 "figma" 字样
2. 清除浏览器缓存
3. 等待 Vercel 的 CDN 更新（可能需要几分钟）

---

## 🔄 如何更新已部署的应用

非常简单！只需推送代码到 GitHub：

```bash
# 修改代码后
git add .
git commit -m "更新说明"
git push

# Vercel 会自动检测并重新部署！
```

---

## 🌐 自定义域名

部署成功后，你可以添加自己的域名：

1. 在 Vercel 项目中，点击 **Settings**
2. 点击 **Domains**
3. 输入你的域名
4. 按照指示在域名注册商处添加 DNS 记录
5. 等待几分钟生效

---

## 📊 查看部署状态

### Vercel Dashboard

访问 https://vercel.com/dashboard 可以看到：
- 📈 部署历史
- 🔍 构建日志
- 📊 访问统计
- ⚙️ 环境变量

### 部署通知

Vercel 会通过邮件通知你：
- ✅ 部署成功
- ❌ 部署失败
- 🔄 新的部署开始

---

## 🎯 最佳实践

1. **使用 Git 分支**
   ```bash
   # 创建开发分支
   git checkout -b dev
   
   # 在 dev 分支上开发和测试
   # 测试通过后合并到 main
   git checkout main
   git merge dev
   git push
   ```

2. **环境变量（如果需要）**
   - Settings → Environment Variables
   - 添加敏感配置（如 API 密钥）
   - 不要在代码中硬编码

3. **预览部署**
   - 每个 PR 都会自动创建预览部署
   - 在合并前测试更改

---

## 🆘 仍然无法解决？

### 调试步骤：

1. **导出构建日志**
   - Vercel Dashboard → Deployment → Build Logs
   - 复制完整日志

2. **检查项目文件**
   - 确认以下文件存在：
     - ✅ `package.json`
     - ✅ `vite.config.ts`
     - ✅ `index.html`
     - ✅ `main.tsx`
     - ✅ `vercel.json`

3. **本地测试构建**
   ```bash
   npm install
   npm run build
   
   # 如果成功，应该看到 dist 文件夹
   # 测试生产构建
   npm run preview
   ```

4. **对比文件**
   - 从 Figma 重新下载最新代码
   - 对比你的项目文件是否有缺失

---

## 📞 获取帮助

如果以上方法都不行，提供以下信息：

1. Vercel 构建日志的截图或文本
2. 浏览器控制台的错误信息（F12 → Console）
3. 你的 Vercel 部署 URL
4. 项目文件列表（`ls -la` 或文件夹截图）

---

**祝部署成功！🚀**
