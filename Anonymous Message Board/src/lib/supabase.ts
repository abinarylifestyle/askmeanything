import { createClient } from '@supabase/supabase-js';
import { mockSupabase } from './mockSupabase';

// Supabase configuration
const supabaseUrl = 'https://hzzvmykbodtbtphowybn.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh6enZteWtib2R0YnRwaG93eWJuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ2NDg5MDEsImV4cCI6MjA4MDIyNDkwMX0.s2VR1X-g9gwe6aPPrjLuU1b9OXvtOz4Lc0cRy-QLqWs';

// 检测是否在 Figma 预览环境中
const isFigmaPreview = typeof window !== 'undefined' && (
  window.location.hostname.includes('figma') ||
  window.location.hostname.includes('figmaiframepreview') ||
  window.location.protocol === 'blob:'
);

// 创建真实的 Supabase 客户端
const realSupabase = createClient(supabaseUrl, supabaseAnonKey);

// 在 Figma 预览中使用模拟数据，其他环境使用真实数据库
export const supabase = isFigmaPreview
  ? mockSupabase as any
  : realSupabase;

export const usingMockData = isFigmaPreview;