import { MessageCircle, Clock } from 'lucide-react';
import { Card } from './ui/card';
import type { Topic } from '../App';

interface TopicCardProps {
  topic: Topic;
  onClick: () => void;
}

export function TopicCard({ topic, onClick }: TopicCardProps) {
  const timeAgo = getTimeAgo(topic.created_at);
  const truncatedDescription = topic.description 
    ? topic.description.length > 80 
      ? topic.description.slice(0, 80) + '...' 
      : topic.description
    : '';

  return (
    <Card
      className="p-5 hover:shadow-lg hover:shadow-purple-900/50 transition-all cursor-pointer bg-gray-900/80 backdrop-blur-sm border-purple-800/30 hover:border-purple-600/50 hover:scale-[1.02]"
      onClick={onClick}
    >
      <div className="space-y-3">
        <h3 className="line-clamp-2 text-white">{topic.title}</h3>
        
        {truncatedDescription && (
          <p className="text-purple-300 line-clamp-2">
            {truncatedDescription}
          </p>
        )}

        <div className="flex items-center justify-between pt-2 border-t border-purple-800/30">
          <div className="flex items-center gap-1 text-purple-400">
            <MessageCircle className="size-4" />
            <span>{topic.message_count} 条回答</span>
          </div>
          <div className="flex items-center gap-1 text-purple-500">
            <Clock className="size-4" />
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