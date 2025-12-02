import { useState, useEffect } from 'react';
import { Plus, Info } from 'lucide-react';
import { Button } from './components/ui/button';
import { TopicCard } from './components/TopicCard';
import { TopicDetailDialog } from './components/TopicDetailDialog';
import { CreateTopicDialog } from './components/CreateTopicDialog';
import { supabase, usingMockData } from './lib/supabase';
import { Alert, AlertDescription } from './components/ui/alert';

export interface Topic {
  id: string;
  title: string;
  description?: string;
  created_at: string;
  message_count: number;
}

export default function App() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTopics();

    // Subscribe to real-time changes
    const channel = supabase
      .channel('topics_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'topics' }, () => {
        fetchTopics();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchTopics = async () => {
    try {
      const { data, error } = await supabase
        .from('topics')
        .select(`
          id,
          title,
          description,
          created_at,
          messages:messages(count)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const topicsWithCount = data?.map(topic => ({
        id: topic.id,
        title: topic.title,
        description: topic.description,
        created_at: topic.created_at,
        message_count: topic.messages[0]?.count || 0
      })) || [];

      setTopics(topicsWithCount);
    } catch (error) {
      console.error('Error fetching topics:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-950 to-black">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-white">🎭 Ask Me Anything</h1>
          <p className="text-purple-300">匿名提问，大胆回答 — 这里没有愚蠢的问题，只有有趣的答案 ✨</p>
        </div>

        {/* Database Status Notice */}
        {usingMockData ? (
          <Alert className="mb-6 bg-purple-950/50 border-purple-700/50 backdrop-blur-sm">
            <Info className="size-4 text-purple-400" />
            <AlertDescription className="text-purple-200">
              📝 Figma 预览模式 - 使用演示数据（数据仅在本次会话中保存）
              <br />
              💡 提示：部署到生产环境后将自动连接真实数据库
            </AlertDescription>
          </Alert>
        ) : (
          <Alert className="mb-6 bg-green-950/50 border-green-700/50 backdrop-blur-sm">
            <Info className="size-4 text-green-400" />
            <AlertDescription className="text-green-200">
              ✅ 已连接到 Supabase 真实数据库 - 所有数据将永久保存
            </AlertDescription>
          </Alert>
        )}

        {/* Create Topic Button */}
        <div className="mb-6 flex justify-end">
          <Button
            onClick={() => setIsCreateDialogOpen(true)}
            className="gap-2 bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-900/50"
          >
            <Plus className="size-4" />
            发起新问题
          </Button>
        </div>

        {/* Topics Grid */}
        {loading ? (
          <div className="text-center py-12 text-purple-300">加载中...</div>
        ) : topics.length === 0 ? (
          <div className="text-center py-12 text-purple-300">
            <p className="mb-4 text-xl">👻 空空如也...</p>
            <p className="mb-6 text-purple-400">成为第一个提问的勇士吧！</p>
            <Button 
              onClick={() => setIsCreateDialogOpen(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-900/50"
            >
              发起第一个问题
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {topics.map(topic => (
              <TopicCard
                key={topic.id}
                topic={topic}
                onClick={() => setSelectedTopic(topic)}
              />
            ))}
          </div>
        )}

        {/* Topic Detail Dialog */}
        <TopicDetailDialog
          topic={selectedTopic}
          open={!!selectedTopic}
          onOpenChange={(open) => {
            if (!open) setSelectedTopic(null);
          }}
          onTopicUpdate={fetchTopics}
        />

        {/* Create Topic Dialog */}
        <CreateTopicDialog
          open={isCreateDialogOpen}
          onOpenChange={setIsCreateDialogOpen}
          onTopicCreated={fetchTopics}
        />
      </div>
    </div>
  );
}