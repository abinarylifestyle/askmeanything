# 🎭 Ask Me Anything - 数据库连接指南

## 📋 快速设置（3步完成）

### 第1步：运行 SQL 创建数据库表

1. 访问 [Supabase Dashboard](https://app.supabase.com)
2. 选择你的项目：`hzzvmykbodtbtphowybn`
3. 点击左侧菜单的 **SQL Editor**
4. 点击 **New Query** 创建新查询
5. 复制 `SETUP_DATABASE.sql` 文件中的全部内容
6. 粘贴到 SQL Editor 中
7. 点击 **Run** 按钮执行
8. 看到 "✅ 数据库设置完成！" 就成功了！

### 第2步：验证表已创建

在 Supabase Dashboard 左侧菜单点击 **Table Editor**，你应该能看到3个表：
- ✅ `topics` - 话题表
- ✅ `messages` - 留言表  
- ✅ `reactions` - 表情反应表

### 第3步：使用真实数据库

**当前状态：**
- ✅ Supabase 凭据已配置
- ✅ 代码已设置好自动切换
- 🎨 在 Figma 预览环境中 = 使用模拟数据（方便快速预览）
- 🌐 在其他环境中（本地开发、生产部署）= 使用真实 Supabase 数据库

**如何测试真实数据库：**

方式1️⃣ **本地开发**
```bash
# 下载代码到本地
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 打开 localhost:5173
# 此时会自动连接到真实 Supabase 数据库！
```

方式2️⃣ **部署到生产环境**
- 部署到 Vercel、Netlify 等平台
- 访问生产环境 URL
- 自动使用真实 Supabase 数据库

---

## 🔍 数据库架构说明

### Topics 表（话题）
```sql
- id: UUID (主键)
- title: 话题标题
- description: 话题描述（可选）
- created_at: 创建时间
```

### Messages 表（留言/回答）
```sql
- id: UUID (主键)
- topic_id: 关联的话题 ID
- content: 留言内容
- created_at: 创建时间
```

### Reactions 表（表情反应）
```sql
- id: UUID (主键)
- message_id: 关联的留言 ID
- emoji: 表情符号
- count: 反应数量
- created_at: 创建时间
```

---

## ⚡ 实时功能

数据库已启用实时订阅，支持：
- 📝 新话题自动显示
- 💬 新留言实时更新
- 😊 表情反应即时同步

多用户同时使用时可以实时看到彼此的互动！

---

## 🔒 安全设置

当前配置为**匿名留言板模式**：
- ✅ 任何人都可以查看内容
- ✅ 任何人都可以发布话题和留言
- ✅ 任何人都可以添加表情反应

**如需增强安全性：**
1. 在 Supabase 中启用用户认证
2. 修改 RLS 策略限制操作权限
3. 添加内容审核功能
4. 实现速率限制防止滥用

---

## 🛠 故障排除

### 问题1：创建话题/留言失败
- 检查 Supabase 项目是否已暂停（免费版闲置会暂停）
- 在 Supabase Dashboard 中唤醒项目

### 问题2：看不到实时更新
- 检查浏览器控制台是否有错误
- 确认 SQL 中的实时订阅已启用

### 问题3：CORS 错误
- 在 Supabase Dashboard > Settings > API
- 确认 API URL 和 anon key 正确
- 检查项目是否启用了 Realtime

---

## 📞 需要帮助？

如遇到问题：
1. 检查浏览器控制台的错误信息
2. 查看 Supabase Dashboard 的 Logs
3. 确认 SQL 已成功执行

祝使用愉快！🎉
