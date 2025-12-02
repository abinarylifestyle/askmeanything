-- ========================================
-- Ask Me Anything 数据库设置
-- ========================================

-- 1. 创建话题表
CREATE TABLE IF NOT EXISTS topics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. 创建留言表
CREATE TABLE IF NOT EXISTS messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  topic_id UUID NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. 创建表情反应表
CREATE TABLE IF NOT EXISTS reactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  message_id UUID NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
  emoji TEXT NOT NULL,
  count INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(message_id, emoji)
);

-- 4. 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_messages_topic_id ON messages(topic_id);
CREATE INDEX IF NOT EXISTS idx_reactions_message_id ON reactions(message_id);
CREATE INDEX IF NOT EXISTS idx_topics_created_at ON topics(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at DESC);

-- 5. 启用实时订阅
ALTER PUBLICATION supabase_realtime ADD TABLE topics;
ALTER PUBLICATION supabase_realtime ADD TABLE messages;
ALTER PUBLICATION supabase_realtime ADD TABLE reactions;

-- 6. 设置行级安全策略 (RLS) - 允许匿名访问
ALTER TABLE topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE reactions ENABLE ROW LEVEL SECURITY;

-- 7. 删除旧策略（如果存在）
DROP POLICY IF EXISTS "Enable read access for all users" ON topics;
DROP POLICY IF EXISTS "Enable insert access for all users" ON topics;
DROP POLICY IF EXISTS "Enable read access for all users" ON messages;
DROP POLICY IF EXISTS "Enable insert access for all users" ON messages;
DROP POLICY IF EXISTS "Enable read access for all users" ON reactions;
DROP POLICY IF EXISTS "Enable insert access for all users" ON reactions;
DROP POLICY IF EXISTS "Enable update access for all users" ON reactions;

-- 8. 创建策略允许所有人读写（匿名留言板）
CREATE POLICY "Enable read access for all users" ON topics FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON topics FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable read access for all users" ON messages FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON messages FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable read access for all users" ON reactions FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON reactions FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON reactions FOR UPDATE USING (true);

-- 9. 插入一些示例数据（可选）
INSERT INTO topics (title, description) VALUES
('如果你能穿越到任何时代，你会选择去哪里？🚀', '过去、现在、未来都可以！说说你的理由吧~'),
('你做过最尴尬的事是什么？😅', '来嘛，大家都是匿名的，没人知道是你！'),
('如果世界末日只剩24小时，你会做什么？💫', '');

-- 完成！
SELECT '✅ 数据库设置完成！' as status;
