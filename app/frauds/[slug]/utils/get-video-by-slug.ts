import { getVideos } from "@/libs/supabase/get-videos";
import { TSlugPageParam } from "../page.type";

export const getVideoBySlug = async (params: TSlugPageParam) => {
  const { slug } = await params;
  const { data: videos, success } = await getVideos({ limit: 1, slug });

  if (!success)
    throw new Error("Tivemos problemas ao buscar a informação do vídeo");

  const video = videos?.[0];

  return { slug, video };
};
