import { Video } from "@/types/global.type";
import { db } from "@/libs/supabase/server";
import { formatDateToBr } from "@/utils/format/dates";
import { generateBucketUrl } from "@/utils/generate/links";

const videoBucket = db().storage.from("videos");
const thumbnailBucket = db().storage.from("thumbnails");

interface IGetVideos {
  page?: number;
  limit: number;
  slug?: string;
}

type TReturnGetVideos =
  | {
      data: Video[];
      totalPages: number;
      success: true;
    }
  | {
      data?: undefined;
      totalPages?: undefined;
      success: false;
    };

export async function getVideos({
  page = 1,
  limit,
  slug,
}: IGetVideos): Promise<TReturnGetVideos> {
  const from = (page - 1) * limit;
  const to = from + limit - 1;

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
        { count: "exact" },
      )
      .order("created_at", { ascending: false });

    if (slug) query = query.eq("slug", slug);

    const { data, error, count } = await query.range(from, to);

    if (error) throw error;

    const total = count ?? 0;

    return {
      data: (data ?? []).map((video) => {
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
      }),
      totalPages: Math.ceil(total / limit),
      success: true,
    };
  } catch (error) {
    console.error("Erro ao buscar vídeos:", error);
    return {
      success: false,
    };
  }
}
