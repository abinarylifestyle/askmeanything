import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { supabase } from '../lib/supabase';

interface Reaction {
  id: string;
  message_id: string;
  emoji: string;
  count: number;
}

interface EmojiReactionsProps {
  messageId: string;
}

const EMOJI_OPTIONS = ['👍', '❤️', '😂', '🎉', '🤔', '👏'];

export function EmojiReactions({ messageId }: EmojiReactionsProps) {
  const [reactions, setReactions] = useState<Reaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReactions();

    // Subscribe to real-time reaction changes
    const channel = supabase
      .channel(`reactions_${messageId}`)
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'reactions',
        filter: `message_id=eq.${messageId}`
      }, () => {
        fetchReactions();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [messageId]);

  const fetchReactions = async () => {
    try {
      const { data, error } = await supabase
        .from('reactions')
        .select('*')
        .eq('message_id', messageId);

      if (error) throw error;
      setReactions(data || []);
    } catch (error) {
      console.error('Error fetching reactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReaction = async (emoji: string) => {
    try {
      const existingReaction = reactions.find(r => r.emoji === emoji);

      if (existingReaction) {
        // Increment existing reaction
        const { error } = await supabase
          .from('reactions')
          .update({ count: existingReaction.count + 1 })
          .eq('id', existingReaction.id);

        if (error) throw error;
      } else {
        // Create new reaction
        const { error } = await supabase
          .from('reactions')
          .insert([{
            message_id: messageId,
            emoji: emoji,
            count: 1
          }]);

        if (error) throw error;
      }

      fetchReactions();
    } catch (error) {
      console.error('Error updating reaction:', error);
    }
  };

  if (loading) {
    return <div className="flex gap-1">
      {EMOJI_OPTIONS.map(emoji => (
        <div key={emoji} className="w-10 h-8 bg-gray-700 rounded animate-pulse" />
      ))}
    </div>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {EMOJI_OPTIONS.map(emoji => {
        const reaction = reactions.find(r => r.emoji === emoji);
        const count = reaction?.count || 0;

        return (
          <Button
            key={emoji}
            variant="outline"
            size="sm"
            className={`h-8 px-2 gap-1 hover:scale-110 transition-transform border-purple-800/50 bg-gray-800/50 hover:bg-purple-900/50 ${
              count > 0 ? 'bg-purple-900/70 border-purple-600/50 text-white' : 'text-purple-300'
            }`}
            onClick={() => handleReaction(emoji)}
          >
            <span>{emoji}</span>
            {count > 0 && <span className="text-purple-200">{count}</span>}
          </Button>
        );
      })}
    </div>
  );
}