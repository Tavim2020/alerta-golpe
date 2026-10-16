import { Video } from "@/types/global.type";
import { db } from "@/libs/supabase/server";
import { formatDateToBr } from "@/utils/format/dates";
import { generateBucketUrl } from "@/utils/generate/links";

const videoBucket = db().storage.from("videos");
const thumbnailBucket = db().storage.from("thumbnails");

interface IGetVideos {
  offset?: number;
  limit?: number;
  slug?: string;
}

export async function getVideos(params?: IGetVideos): Promise<Video[]> {
  const { offset = 0, limit = 50, slug } = params ?? {};

  const maxVideos = offset + limit - 1;

  try {
    let query = db()
      .from("videos")
      .select(
        `
        *,
        sub_category:sub_categories!videos_sub_category_id_fkey (
          id,
          name,
          category:categories!sub_categories_category_id_fkey (
            id,
            name
          )
        )
      `,
      )
      .order("created_at", { ascending: false })
      .range(offset, maxVideos);

    if (slug) query = query.eq("slug", slug);

    const { data, error } = await query;

    if (error) throw error;

    return (data ?? []).map((video) => {
      const { data: videoData } = videoBucket.getPublicUrl(video.file_name);
      const { data: thumbnailData } = thumbnailBucket.getPublicUrl(
        video.thumbnail,
      );

      return {
        ...video,
        created_at: formatDateToBr(video.created_at),
        updated_at: formatDateToBr(video.created_at),
        video_url: generateBucketUrl(videoData.publicUrl),
        thumbnail_url: generateBucketUrl(thumbnailData.publicUrl),
        tips: video.tips === "string" ? JSON.parse(video.tips) : video.tips,
      };
    });
  } catch (error) {
    console.error("Erro ao buscar vídeos:", error);
    return [];
  }
}
