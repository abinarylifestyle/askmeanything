# 🎭 Ask Me Anything

一个简约、神秘风格的匿名留言板应用，使用 React + Tailwind CSS + Supabase 构建。

## ✨ 功能特性

- 🎯 **话题广场** - 卡片式布局展示所有话题
- 💬 **匿名留言** - 无需登录，自由发表观点
- 😊 **表情反应** - 预设 emoji，支持点击 +1
- ⚡ **实时同步** - 多用户实时互动
- 🎨 **神秘主题** - 黑色调 + 紫色高光
- 📱 **响应式设计** - 完美适配移动端

## 🚀 快速开始

### 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 在浏览器中打开 http://localhost:5173
```

### 构建生产版本

```bash
npm run build
```

## 🗄️ 数据库设置

1. 访问 [Supabase Dashboard](https://app.supabase.com)
2. 进入 SQL Editor
3. 复制 `SETUP_DATABASE.sql` 的内容并运行
4. 完成！应用会自动连接到数据库

详细步骤请查看 `README_DATABASE.md`

## 🌐 部署

### 部署到 Vercel（推荐）

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

1. 点击上方按钮
2. 导入 Git 仓库
3. 点击 Deploy
4. 完成！

### 部署到 Netlify

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start)

1. 点击上方按钮
2. 连接 Git 仓库
3. 点击 Deploy
4. 完成！

## 📦 技术栈

- **框架**: React 18 + TypeScript
- **样式**: Tailwind CSS v4
- **数据库**: Supabase (PostgreSQL)
- **构建工具**: Vite
- **UI 组件**: Shadcn/ui
- **图标**: Lucide React

## 🔒 安全说明

当前配置为匿名留言板模式，任何人都可以发布内容。

如需增强安全性：
- 启用用户认证
- 配置内容审核
- 添加速率限制
- 修改 RLS 策略

## 📝 License

MIT

---

Made with ❤️ and 🎭
