import { AdsSlot } from "@/lib/ads/components/ads-slot";
import { EmptyVideos } from "@/components/videos/empty-videos";
import { ShowVideos } from "@/components/videos/show-videos";
import { SERVER_ENVIRONMENT } from "@/environments/server.environment";
import { getVideos } from "@/lib/server";

const { NEXT_PUBLIC_ADSENSE_SLOT } = SERVER_ENVIRONMENT;

export const LastVideos = async () => {
  const videos = await getVideos({ limit: 12 });

  return (
    <div className="mx-auto max-w-6xl px-4">
      <AdsSlot slotNumber={NEXT_PUBLIC_ADSENSE_SLOT} />

      <h2 className="mb-5 font-display text-3xl">Últimos golpes</h2>

      {videos.length ? <ShowVideos videos={videos} /> : <EmptyVideos />}

      <AdsSlot slotNumber={NEXT_PUBLIC_ADSENSE_SLOT} />
    </div>
  );
};
