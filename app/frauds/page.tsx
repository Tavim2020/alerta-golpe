import type { Metadata } from "next";
import { getVideos } from "@/libs/supabase/get-videos";
import { SERVER_ENVIRONMENT } from "@/environments/server.environment";
import { AdsSlot } from "@/libs/ads/components/ads-slot";
import { PreviewVideosCard } from "@/components/videos/preview-video-card";
import { EmptyVideos } from "@/components/videos/empty-videos";
import { APP_ROUTE } from "@/routes/app.route";
import { TipCard } from "./components/tip-card";
import { fraudsPageTips } from "./constants/frauds.constant";
import { IFraudPageProps } from "./page.type";
import { Pagination } from "./components/pagination";

const { NEXT_PUBLIC_ADSENSE_SLOT } = SERVER_ENVIRONMENT;

export const revalidate = 60;
export const metadata: Metadata = {
  title: "Golpes sofridos",
  description:
    "Relatos em vídeo de golpes reais: PIX, WhatsApp, falsa central, boletos e mais. Aprenda a reconhecer cada um.",
  alternates: { canonical: APP_ROUTE.FRAUDS.ROOT },
};

export default async function Frauds({ searchParams }: IFraudPageProps) {
  const { page } = await searchParams;

  const pageNumber = Number(page);

  if (page && isNaN(pageNumber))
    throw new Error("Parâmetro de busca(page) inválido!");

  const currentPage = pageNumber || 1;

  const {
    data: videos,
    success,
    totalPages,
  } = await getVideos({ page: currentPage, limit: 24 });

  if (!success) throw new Error("Tivemos problemas ao buscar os videos");

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="font-display text-5xl">Golpes sofridos</h1>

      <p className="mt-3 max-w-2xl text-lg">
        Cada vídeo mostra um golpe que realmente aconteceu. Compartilhe com quem
        você quer proteger.
      </p>

      <ul className="mt-8 grid gap-4 md:grid-cols-3">
        {fraudsPageTips.map(({ title, description }) => (
          <TipCard key={title} title={title} description={description} />
        ))}
      </ul>

      <AdsSlot slotNumber={NEXT_PUBLIC_ADSENSE_SLOT} />

      {videos.length ? <PreviewVideosCard videos={videos} /> : <EmptyVideos />}

      <Pagination
        basePath={APP_ROUTE.FRAUDS.ROOT}
        totalPages={totalPages}
        currentPage={currentPage}
      />
    </div>
  );
}
