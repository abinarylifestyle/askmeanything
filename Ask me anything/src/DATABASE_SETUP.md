# 数据库设置指南

## Supabase 数据库结构

在你的 Supabase 项目中，运行以下 SQL 来创建所需的表结构：

```sql
-- 创建话题表
CREATE TABLE topics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建留言表
CREATE TABLE messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  topic_id UUID NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建表情反应表
CREATE TABLE reactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  message_id UUID NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
  emoji TEXT NOT NULL,
  count INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(message_id, emoji)
);

-- 创建索引以提高查询性能
CREATE INDEX idx_messages_topic_id ON messages(topic_id);
CREATE INDEX idx_reactions_message_id ON reactions(message_id);
CREATE INDEX idx_topics_created_at ON topics(created_at DESC);
CREATE INDEX idx_messages_created_at ON messages(created_at DESC);

-- 启用实时订阅
ALTER PUBLICATION supabase_realtime ADD TABLE topics;
ALTER PUBLICATION supabase_realtime ADD TABLE messages;
ALTER PUBLICATION supabase_realtime ADD TABLE reactions;

-- 设置行级安全策略 (RLS) - 允许匿名访问
ALTER TABLE topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE reactions ENABLE ROW LEVEL SECURITY;

-- 创建策略允许所有人读写（匿名留言板）
CREATE POLICY "Enable read access for all users" ON topics FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON topics FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable read access for all users" ON messages FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON messages FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable read access for all users" ON reactions FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON reactions FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON reactions FOR UPDATE USING (true);
```

## 配置步骤

1. 在 [Supabase](https://app.supabase.com) 创建新项目
2. 在 SQL Editor 中运行上述 SQL 语句
3. 获取项目的 URL 和 anon key：
   - 进入 Project Settings > API
   - 复制 "Project URL" 和 "anon public" key
4. 创建 `.env` 文件（参考 `.env.example`）并填入你的凭据：
   ```
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

## 功能说明

- **topics** - 存储所有话题
- **messages** - 存储话题下的留言
- **reactions** - 存储留言的表情反应，使用 UNIQUE 约束确保每个留言的每个表情只有一条记录
- **RLS 策略** - 允许匿名用户自由读写，适合匿名留言板场景
- **实时订阅** - 启用后可实时看到其他用户的留言和反应
- **级联删除** - 删除话题时自动删除相关留言和反应

## 安全提示

当前配置允许任何人读写数据，适合匿名留言板。如需增强安全性：
- 可添加速率限制
- 可添加内容审核
- 可实现用户认证和授权
