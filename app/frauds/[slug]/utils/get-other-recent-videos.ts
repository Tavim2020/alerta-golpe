import { getVideos } from "@/libs/supabase/get-videos";

export const getOtherRecentVideos = async (videoId: string) => {
  return (await getVideos({ limit: 4 }))
    .filter((other) => other.id !== videoId)
    .slice(0, 3);
};
