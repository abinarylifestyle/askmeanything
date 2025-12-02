# 🚀 开始使用 - Ask Me Anything

## ❌ 常见错误

**如果你直接双击 `index.html` 打开，会看到空白页面！**

这是正常的，因为：
- React 应用需要通过开发服务器运行
- 需要先安装依赖（node_modules）
- 需要编译 TypeScript 和 JSX 代码

---

## ✅ 正确的启动方式

### 📋 前置要求

确保你已经安装了 Node.js：
- 访问 https://nodejs.org
- 下载并安装 LTS 版本（推荐 18.x 或 20.x）
- 安装完成后，打开终端验证：
  ```bash
  node --version
  npm --version
  ```

### 🎯 步骤 1：安装依赖

打开终端（命令行），进入项目文件夹：

```bash
# Mac/Linux
cd /path/to/your/project

# Windows
cd C:\path\to\your\project

# 安装所有依赖
npm install
```

**这一步会下载所有需要的库**，可能需要 2-5 分钟。

### 🎯 步骤 2：启动开发服务器

```bash
npm run dev
```

你会看到类似这样的输出：
```
  VITE v5.1.0  ready in 500 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### 🎯 步骤 3：在浏览器中打开

打开浏览器，访问：
```
http://localhost:5173
```

🎉 **现在应该能看到你的应用了！**

---

## 🔧 如果还是空白页面

### 检查清单：

#### 1️⃣ 检查浏览器控制台

- 在浏览器中按 `F12` 打开开发者工具
- 查看 **Console** 标签
- 如果有红色错误，复制错误信息

#### 2️⃣ 检查终端输出

- 查看运行 `npm run dev` 的终端
- 是否有错误信息？

#### 3️⃣ 常见问题和解决方法

**问题：`npm: command not found`**
```
解决：需要先安装 Node.js
访问 https://nodejs.org 下载安装
```

**问题：端口被占用**
```
解决：Vite 会自动使用下一个可用端口
查看终端输出的实际端口号
```

**问题：依赖安装失败**
```bash
# 清除缓存重试
rm -rf node_modules package-lock.json
npm install
```

**问题：Supabase 连接错误**
```
确保已经在 Supabase 中运行了 SETUP_DATABASE.sql
查看 README_DATABASE.md 了解详情
```

---

## 🌐 部署到生产环境

**本地开发服务器仅用于开发！**

要让其他人访问你的应用，需要部署到生产环境。

### 最简单的方式：部署到 Vercel

查看 `DEPLOYMENT_GUIDE.md` 获取详细步骤。

简单来说：
1. 将代码推送到 GitHub
2. 在 Vercel 中连接 GitHub 仓库
3. 点击部署
4. 完成！

---

## 📁 项目结构

```
/
├── App.tsx                 # 主应用组件
├── main.tsx                # React 入口文件
├── index.html              # HTML 模板
├── package.json            # 项目配置和依赖
├── vite.config.ts          # Vite 配置
├── tsconfig.json           # TypeScript 配置
│
├── components/             # React 组件
│   ├── TopicCard.tsx
│   ├── MessageItem.tsx
│   └── ui/                 # Shadcn UI 组件
│
├── lib/                    # 工具函数
│   ├── supabase.ts         # Supabase 客户端
│   └── mockSupabase.ts     # 模拟数据（开发用）
│
├── styles/
│   └── globals.css         # 全局样式
│
└── SETUP_DATABASE.sql      # 数据库设置脚本
```

---

## 🎯 快速命令参考

```bash
# 安装依赖
npm install

# 启动开发服务器（本地预览）
npm run dev

# 构建生产版本
npm run build

# 预览生产构建
npm run preview
```

---

## 🆘 需要帮助？

### 步骤 1：检查数据库

确保已在 Supabase 中运行 `SETUP_DATABASE.sql`
- 查看 `README_DATABASE.md`

### 步骤 2：查看错误信息

- 浏览器控制台（F12）
- 终端输出

### 步骤 3：常见问题

**应用显示"Figma 预览模式"**
→ 这是正常的！在本地开发时会自动检测环境
→ 部署到 Vercel/Netlify 后会自动切换到真实数据库

**无法连接 Supabase**
→ 检查网络连接
→ 确认 Supabase 项目未暂停

**样式不显示**
→ 确保 `npm install` 已完成
→ 检查 `/styles/globals.css` 文件存在

---

## 🎉 成功运行后

你应该能看到：
- 🎭 黑色神秘主题
- 💬 话题卡片
- ✨ "Ask Me Anything" 大标题
- 🟣 紫色按钮和强调色

享受你的匿名留言板应用吧！🚀
