import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { Video } from '@/lib/types';

type Database = {
  public: {
    Tables: {
      videos: {
        Row: Video;
        Insert: {
          id?: string;
          slug: string;
          title: string;
          description?: string | null;
          video_url: string;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          slug?: string;
          title?: string;
          description?: string | null;
          video_url?: string;
          created_at?: string | null;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

export const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export function db(): SupabaseClient<Database> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY devem estar configuradas.');
  }

  return createClient<Database>(url, serviceRoleKey);
}

export async function getVideos(limit?: number): Promise<Video[]> {
  try {
    let query = db().from('videos').select('*').order('created_at', { ascending: false });
    if (limit) query = query.limit(limit);
    return (await query).data ?? [];
  } catch {
    return [];
  }
}

export async function getVideo(slug: string): Promise<Video | null> {
  try {
    return (await db().from('videos').select('*').eq('slug', slug).maybeSingle()).data;
  } catch {
    return null;
  }
}
