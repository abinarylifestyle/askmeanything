import { Clock } from 'lucide-react';
import { Card } from './ui/card';
import { EmojiReactions } from './EmojiReactions';

interface Message {
  id: string;
  topic_id: string;
  content: string;
  created_at: string;
}

interface MessageItemProps {
  message: Message;
}

export function MessageItem({ message }: MessageItemProps) {
  const timeAgo = getTimeAgo(message.created_at);

  return (
    <Card className="p-4 bg-gray-800/60 backdrop-blur-sm border-purple-800/30">
      <div className="space-y-3">
        <p className="whitespace-pre-wrap break-words text-purple-100">{message.content}</p>
        
        <div className="flex items-center justify-between pt-2 border-t border-purple-800/30">
          <EmojiReactions messageId={message.id} />
          <div className="flex items-center gap-1 text-purple-500">
            <Clock className="size-3" />
            <span>{timeAgo}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}

function getTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return '刚刚';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}分钟前`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}小时前`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}天前`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}个月前`;
  const years = Math.floor(months / 12);
  return `${years}年前`;
}