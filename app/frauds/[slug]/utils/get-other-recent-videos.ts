import { getVideos } from "@/libs/supabase/get-videos";

export const getOtherRecentVideos = async (videoId: string) => {
  const { data: videos, success } = await getVideos({ limit: 4 });

  if (!success)
    throw new Error("Tivemos problemas ao buscar os vídeos mais recentes");

  return videos.filter((other) => other.id !== videoId).slice(0, 3);
};
