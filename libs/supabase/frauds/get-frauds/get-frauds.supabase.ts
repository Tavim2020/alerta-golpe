import { TFraud, TServerDefaultResponse } from "@/types/global.type";
import { db } from "@/libs/supabase/server";
import { formatDateToBr } from "@/utils/format/dates";
import { generateBucketUrl } from "@/utils/generate/links";
import { thumbnailBucket, videoBucket } from "../../storages/supabase.storage";
import { TSlugPageParam } from "@/types/global.type";
import { notFound } from "next/navigation";

interface IGetFrauds {
  page?: number;
  limit: number;
  slug?: string;
  search?: string;
}

export async function getFrauds({
  page = 1,
  limit,
  slug,
  search,
}: IGetFrauds): Promise<TServerDefaultResponse<TFraud[]>> {
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  try {
    let query = db()
      .from("frauds")
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
      .order("updated_at", { ascending: false });

    if (slug) query = query.eq("slug", slug);

    if (search?.trim()) {
      const { data: matchingIds, error: searchError } = await db().rpc(
        "search_frauds",
        {
          search_term: search.trim(),
        },
      );

      if (searchError) throw searchError;

      const ids = (matchingIds ?? []) as string[];

      if (ids.length === 0) {
        return {
          data: [],
          totalPages: 0,
          success: true,
        };
      }

      query = query.in("id", ids);
    }

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
          updated_at: formatDateToBr(video.updated_at),
          video_url: generateBucketUrl(videoData.publicUrl),
          thumbnail_url: generateBucketUrl(thumbnailData.publicUrl),
          tips: video.tips === "string" ? JSON.parse(video.tips) : video.tips,
        };
      }),
      totalPages: Math.ceil(total / limit),
      success: true,
    };
  } catch (error) {
    console.error("Erro ao buscar as fraudes:", error);
    return {
      success: false,
    };
  }
}

export const getFraudBySlug = async (fraudSlug: string) => {
  const { data: frauds, success } = await getFrauds({
    limit: 1,
    slug: fraudSlug,
  });

  if (!success)
    throw new Error("Tivemos problemas ao buscar a informação do golpe");

  const fraud = frauds?.[0];

  if (!fraud) return notFound();

  return { fraud };
};
