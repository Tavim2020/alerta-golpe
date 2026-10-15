import type { Metadata } from "next";
import { getVideos } from "@/lib/server";
import { SERVER_ENVIRONMENT } from "@/environments/server.environment";
import { AdsSlot } from "@/lib/ads/components/ads-slot";
import { ShowVideos } from "@/components/videos/show-videos";
import { EmptyVideos } from "@/components/videos/empty-videos";
import { APP_ROUTE } from "@/routes/app.route";
import { ShowTip } from "./components/show-tip";
import { fraudsPageTips } from "./constants/frauds.constant";

const { NEXT_PUBLIC_ADSENSE_SLOT } = SERVER_ENVIRONMENT;

export const revalidate = 60;
export const metadata: Metadata = {
  title: "Golpes sofridos",
  description:
    "Relatos em vídeo de golpes reais: PIX, WhatsApp, falsa central, boletos e mais. Aprenda a reconhecer cada um.",
  alternates: { canonical: APP_ROUTE.FRAUDS.ROOT },
};

export default async function Frauds() {
  const videos = await getVideos();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="font-display text-5xl">Golpes sofridos</h1>

      <p className="mt-3 max-w-2xl text-lg">
        Cada vídeo mostra um golpe que realmente aconteceu. Compartilhe com quem
        você quer proteger.
      </p>

      <ul className="mt-8 grid gap-4 md:grid-cols-3">
        {fraudsPageTips.map(([title, description]) => (
          <ShowTip key={title} title={title} description={description} />
        ))}
      </ul>

      <AdsSlot slotNumber={NEXT_PUBLIC_ADSENSE_SLOT} />

      {videos.length ? <ShowVideos videos={videos} /> : <EmptyVideos />}
    </div>
  );
}
