import { getVideos } from "@/lib/server";
import { TFraudIdPageParam } from "../page.type";

export const getVideo = async (params: TFraudIdPageParam) => {
  const { "fraud-id": fraudId } = await params;
  const videos = await getVideos({ limit: 1, fileId: fraudId });
  const video = videos?.[0];

  return { fraudId, video };
};
