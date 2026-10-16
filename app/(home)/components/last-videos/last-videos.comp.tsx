import { AdsSlot } from "@/libs/ads/components/ads-slot";
import { EmptyVideos } from "@/components/videos/empty-videos";
import { PreviewVideosCard } from "@/components/videos/preview-video-card";
import { SERVER_ENVIRONMENT } from "@/environments/server.environment";
import { getVideos } from "@/libs/supabase/get-videos";

const { NEXT_PUBLIC_ADSENSE_SLOT } = SERVER_ENVIRONMENT;

export const LastVideos = async () => {
  const { data: videos, success } = await getVideos({ limit: 12 });

  if (!success)
    throw new Error("Tivemos problemas ao buscar os últimos vídeos");

  return (
    <div className="mx-auto max-w-6xl px-4">
      <AdsSlot slotNumber={NEXT_PUBLIC_ADSENSE_SLOT} />

      <h2 className="mb-5 font-display text-3xl">Últimos golpes</h2>

      {videos.length ? <PreviewVideosCard videos={videos} /> : <EmptyVideos />}

      <AdsSlot slotNumber={NEXT_PUBLIC_ADSENSE_SLOT} />
    </div>
  );
};
