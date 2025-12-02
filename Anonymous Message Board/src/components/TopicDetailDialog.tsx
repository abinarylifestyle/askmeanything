import { useState, useEffect } from 'react';
import { X, Send } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { MessageItem } from './MessageItem';
import { supabase } from '../lib/supabase';
import type { Topic } from '../App';

interface Message {
  id: string;
  topic_id: string;
  content: string;
  created_at: string;
}

interface TopicDetailDialogProps {
  topic: Topic | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTopicUpdate: () => void;
}

export function TopicDetailDialog({ topic, open, onOpenChange, onTopicUpdate }: TopicDetailDialogProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (topic?.id) {
      fetchMessages();

      // Subscribe to real-time message changes
      const channel = supabase
        .channel(`messages_${topic.id}`)
        .on('postgres_changes', { 
          event: '*', 
          schema: 'public', 
          table: 'messages',
          filter: `topic_id=eq.${topic.id}`
        }, () => {
          fetchMessages();
          onTopicUpdate();
        })
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [topic?.id]);

  const fetchMessages = async () => {
    if (!topic?.id) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('topic_id', topic.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !topic?.id || submitting) return;

    setSubmitting(true);
    try {
      const { error } = await supabase
        .from('messages')
        .insert([{
          topic_id: topic.id,
          content: newMessage.trim()
        }]);

      if (error) throw error;

      setNewMessage('');
      fetchMessages();
    } catch (error) {
      console.error('Error creating message:', error);
      alert('发送失败，请重试');
    } finally {
      setSubmitting(false);
    }
  };

  if (!topic) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col p-0 bg-gray-900 border-purple-800/50 text-white">
        <DialogHeader className="p-6 pb-4 border-b border-purple-800/30">
          <DialogTitle className="pr-8 text-white">{topic.title}</DialogTitle>
          {topic.description && (
            <p className="text-purple-300 mt-2">{topic.description}</p>
          )}
        </DialogHeader>

        {/* Messages List */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {loading ? (
            <div className="text-center py-8 text-purple-400">加载中...</div>
          ) : messages.length === 0 ? (
            <div className="text-center py-8 text-purple-400">
              <p className="text-2xl mb-2">🤔</p>
              <p>还没有回答，来发第一条吧！</p>
            </div>
          ) : (
            messages.map(message => (
              <MessageItem key={message.id} message={message} />
            ))
          )}
        </div>

        {/* New Message Form */}
        <form onSubmit={handleSubmit} className="p-6 pt-4 border-t border-purple-800/30 bg-gray-900/50">
          <div className="space-y-3">
            <Textarea
              placeholder="写下你的回答..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="min-h-[100px] resize-none bg-gray-800 border-purple-800/50 text-white placeholder:text-purple-400/50 focus:border-purple-600"
              disabled={submitting}
            />
            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={!newMessage.trim() || submitting}
                className="gap-2 bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-900/50"
              >
                <Send className="size-4" />
                {submitting ? '发送中...' : '发送回答'}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}