import { TArticles, TServerDefaultResponse } from "@/types/global.type";
import { db } from "@/libs/supabase/server";
import { formatDateToBr } from "@/utils/format/dates";
import { generateBucketUrl } from "@/utils/generate/links";
import { articlesThumbnail } from "@/libs/supabase/storages/supabase.storage";
import { notFound } from "next/navigation";

interface IGetArticles {
  page?: number;
  limit: number;
  slug?: string;
}

export async function getArticles({
  page = 1,
  limit,
  slug,
}: IGetArticles): Promise<TServerDefaultResponse<TArticles[]>> {
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  try {
    let query = db()
      .from("articles")
      .select("*", { count: "exact" })
      .order("updated_at", { ascending: false });

    if (slug) query = query.eq("slug", slug);

    const { data, error, count } = await query.range(from, to);

    if (error) throw error;

    const total = count ?? 0;

    return {
      data: (data ?? []).map((video) => {
        const { data: thumbnailData } = articlesThumbnail.getPublicUrl(
          video.thumbnail,
        );

        return {
          ...video,
          created_at: formatDateToBr(video.created_at),
          updated_at: formatDateToBr(video.updated_at),
          thumbnail_url: generateBucketUrl(thumbnailData.publicUrl),
          tips: video.tips === "string" ? JSON.parse(video.tips) : video.tips,
        };
      }),
      totalPages: Math.ceil(total / limit),
      success: true,
    };
  } catch (error) {
    console.error("Erro ao buscar os artigos:", error);
    return {
      success: false,
    };
  }
}

export const getArticlesBySlug = async (articleSlug: string) => {
  const { data: articles, success: successArticles } = await getArticles({
    limit: 1,
    slug: articleSlug,
  });

  if (!successArticles)
    throw new Error("Tivemos problemas ao buscar a informação do artigo");

  const article = articles?.[0];

  if (!article) return notFound();

  return { article };
};
