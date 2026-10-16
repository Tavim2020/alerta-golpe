import { getVideos } from "@/libs/supabase/get-videos";
import { TFraudIdPageParam } from "../page.type";

export const getVideoBySlug = async (params: TFraudIdPageParam) => {
  const { slug } = await params;
  const videos = await getVideos({ limit: 1, slug });
  const video = videos?.[0];

  return { slug, video };
};
