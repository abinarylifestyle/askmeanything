// Mock Supabase client for demo purposes
// This simulates Supabase functionality using local state

interface Topic {
  id: string;
  title: string;
  description: string | null;
  created_at: string;
}

interface Message {
  id: string;
  topic_id: string;
  content: string;
  created_at: string;
}

interface Reaction {
  id: string;
  message_id: string;
  emoji: string;
  count: number;
  created_at: string;
}

// In-memory storage
let topics: Topic[] = [
  {
    id: '1',
    title: '如果你能穿越到任何时代，你会选择去哪里？🚀',
    description: '过去、现在、未来都可以！说说你的理由吧~',
    created_at: new Date(Date.now() - 3600000).toISOString()
  },
  {
    id: '2',
    title: '你做过最尴尬的事是什么？😅',
    description: '来嘛，大家都是匿名的，没人知道是你！',
    created_at: new Date(Date.now() - 7200000).toISOString()
  },
  {
    id: '3',
    title: '如果世界末日只剩24小时，你会做什么？💫',
    description: '',
    created_at: new Date(Date.now() - 10800000).toISOString()
  }
];

let messages: Message[] = [
  {
    id: 'm1',
    topic_id: '1',
    content: '我想去文艺复兴时期！想看看达芬奇本人画《蒙娜丽莎》，顺便问问他为什么要画得这么神秘 🎨',
    created_at: new Date(Date.now() - 1800000).toISOString()
  },
  {
    id: 'm2',
    topic_id: '2',
    content: '有一次在电梯里对着镜子做鬼脸，结果转头发现后面站了一个人... 尴尬到想挖地洞钻进去 😭',
    created_at: new Date(Date.now() - 3000000).toISOString()
  },
  {
    id: 'm3',
    topic_id: '1',
    content: '我要去恐龙时代！想骑霸王龙上班，多拉风啊~ 🦖',
    created_at: new Date(Date.now() - 2400000).toISOString()
  }
];

let reactions: Reaction[] = [
  {
    id: 'r1',
    message_id: 'm1',
    emoji: '👍',
    count: 5,
    created_at: new Date(Date.now() - 1500000).toISOString()
  },
  {
    id: 'r2',
    message_id: 'm1',
    emoji: '❤️',
    count: 3,
    created_at: new Date(Date.now() - 1400000).toISOString()
  }
];

type Listener = () => void;
const listeners: { [key: string]: Listener[] } = {};

function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

function notifyListeners(channel: string) {
  const channelListeners = listeners[channel] || [];
  channelListeners.forEach(listener => listener());
}

export const mockSupabase = {
  from: (table: string) => ({
    select: (query: string = '*') => ({
      eq: (column: string, value: any) => ({
        order: (orderColumn: string, options?: { ascending: boolean }) => ({
          then: async (resolve: any) => {
            await new Promise(r => setTimeout(r, 300)); // Simulate network delay
            
            if (table === 'messages') {
              const filtered = messages.filter((m: any) => m[column] === value);
              const sorted = [...filtered].sort((a, b) => {
                const aTime = new Date(a[orderColumn]).getTime();
                const bTime = new Date(b[orderColumn]).getTime();
                return options?.ascending ? aTime - bTime : bTime - aTime;
              });
              resolve({ data: sorted, error: null });
            } else if (table === 'reactions') {
              const filtered = reactions.filter((r: any) => r[column] === value);
              resolve({ data: filtered, error: null });
            }
            return { data: [], error: null };
          }
        })
      }),
      order: (column: string, options?: { ascending: boolean }) => ({
        then: async (resolve: any) => {
          await new Promise(r => setTimeout(r, 300)); // Simulate network delay
          
          if (table === 'topics') {
            const topicsWithMessages = topics.map(topic => ({
              ...topic,
              messages: [{ count: messages.filter(m => m.topic_id === topic.id).length }]
            }));
            const sorted = [...topicsWithMessages].sort((a, b) => {
              const aTime = new Date(a[column]).getTime();
              const bTime = new Date(b[column]).getTime();
              return options?.ascending ? aTime - bTime : bTime - aTime;
            });
            resolve({ data: sorted, error: null });
          }
          return { data: [], error: null };
        }
      })
    }),
    insert: (records: any[]) => ({
      then: async (resolve: any) => {
        await new Promise(r => setTimeout(r, 200)); // Simulate network delay
        
        if (table === 'topics') {
          const newTopics = records.map(r => ({
            id: generateId(),
            ...r,
            created_at: new Date().toISOString()
          }));
          topics = [...newTopics, ...topics];
          notifyListeners('topics_changes');
          resolve({ data: newTopics, error: null });
        } else if (table === 'messages') {
          const newMessages = records.map(r => ({
            id: generateId(),
            ...r,
            created_at: new Date().toISOString()
          }));
          messages = [...newMessages, ...messages];
          notifyListeners(`messages_${records[0].topic_id}`);
          notifyListeners('topics_changes');
          resolve({ data: newMessages, error: null });
        } else if (table === 'reactions') {
          const newReactions = records.map(r => ({
            id: generateId(),
            ...r,
            created_at: new Date().toISOString()
          }));
          reactions = [...newReactions, ...reactions];
          notifyListeners(`reactions_${records[0].message_id}`);
          resolve({ data: newReactions, error: null });
        }
        return { data: null, error: null };
      }
    }),
    update: (updates: any) => ({
      eq: (column: string, value: any) => ({
        then: async (resolve: any) => {
          await new Promise(r => setTimeout(r, 200)); // Simulate network delay
          
          if (table === 'reactions') {
            reactions = reactions.map(r => 
              r[column as keyof Reaction] === value ? { ...r, ...updates } : r
            );
            const reaction = reactions.find(r => r[column as keyof Reaction] === value);
            if (reaction) {
              notifyListeners(`reactions_${reaction.message_id}`);
            }
            resolve({ data: null, error: null });
          }
          return { data: null, error: null };
        }
      })
    })
  }),
  channel: (name: string) => ({
    on: (event: string, options: any, callback: () => void) => {
      if (!listeners[name]) {
        listeners[name] = [];
      }
      listeners[name].push(callback);
      return {
        subscribe: () => {}
      };
    }
  }),
  removeChannel: (channel: any) => {
    // Clean up listeners if needed
  }
};