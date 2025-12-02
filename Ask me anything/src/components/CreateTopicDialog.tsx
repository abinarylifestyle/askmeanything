import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { supabase } from '../lib/supabase';

interface CreateTopicDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTopicCreated: () => void;
}

export function CreateTopicDialog({ open, onOpenChange, onTopicCreated }: CreateTopicDialogProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || submitting) return;

    setSubmitting(true);
    try {
      const { error } = await supabase
        .from('topics')
        .insert([{
          title: title.trim(),
          description: description.trim() || null
        }]);

      if (error) throw error;

      setTitle('');
      setDescription('');
      onOpenChange(false);
      onTopicCreated();
    } catch (error) {
      console.error('Error creating topic:', error);
      alert('创建失败，请重试');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-gray-900 border-purple-800/50 text-white">
        <DialogHeader>
          <DialogTitle className="text-white">🎯 发起新问题</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-purple-300">问题标题 *</Label>
            <Input
              id="title"
              placeholder="你想问什么？"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={submitting}
              maxLength={100}
              className="bg-gray-800 border-purple-800/50 text-white placeholder:text-purple-400/50 focus:border-purple-600"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-purple-300">补充说明（可选）</Label>
            <Textarea
              id="description"
              placeholder="详细描述你的问题..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={submitting}
              className="min-h-[100px] resize-none bg-gray-800 border-purple-800/50 text-white placeholder:text-purple-400/50 focus:border-purple-600"
              maxLength={500}
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={submitting}
              className="border-purple-800/50 bg-gray-800/50 text-purple-300 hover:bg-gray-700"
            >
              取消
            </Button>
            <Button
              type="submit"
              disabled={!title.trim() || submitting}
              className="bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-900/50"
            >
              {submitting ? '创建中...' : '创建问题'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}