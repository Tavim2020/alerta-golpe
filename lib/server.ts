import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { removeMimeType } from "@/utils/format/strings";
import { formatDateToBr } from "@/utils/format/dates";
import { Video } from "@/types/global.type";

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

export const SITE = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export function db(): SupabaseClient<Database> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY devem estar configuradas.",
    );
  }

  return createClient<Database>(url, serviceRoleKey);
}

interface IGetVideos {
  offset?: number;
  limit?: number;
  fileId?: string;
}

export async function getVideos(params?: IGetVideos): Promise<Video[]> {
  const { offset, limit, fileId } = {
    offset: params?.offset || 0,
    limit: params?.limit || 50,
    fileId: params?.fileId,
  };

  try {
    const bucket = db().storage.from("videos");

    const { data: files, error } = await bucket.list(undefined, {
      search: fileId,
      offset,
      limit: limit,
      sortBy: {
        column: "created_at",
        order: "desc",
      },
    });

    if (error) throw error;

    const videos = (files || []).reduce((acc, file) => {
      if (!file.id) return acc;

      const { data } = bucket.getPublicUrl(file.name);

      return (acc = [
        ...acc,
        {
          id: file.id,
          slug: removeMimeType(file.name),
          title: removeMimeType(file.name),
          video_url: data.publicUrl,
          created_at: formatDateToBr(file.created_at),
        },
      ]);
    }, [] as Video[]);

    return videos;
  } catch (error) {
    console.error("Erro ao buscar vídeos do Storage:", error);
    return [];
  }
}
