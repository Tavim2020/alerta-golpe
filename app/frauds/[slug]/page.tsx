import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { SERVER_ENVIRONMENT } from "@/environments/server.environment";
import { AdsSlot } from "@/libs/ads/components/ads-slot";
import { APP_ROUTE } from "@/routes/app.route";
import { TVideoPageProps } from "./page.type";
import { getVideoBySlug } from "./utils/get-video-by-slug";
import { generateWhatsAppShareLink } from "@/utils/generate/links";
import { LdJsonScript } from "@/components/scripts/ld-json";
import { getOtherRecentVideos } from "./utils/get-other-recent-videos";
import { PreviewCard } from "@/components/videos/preview-video-card/components/preview-card";
import { BadgeCategory } from "@/components/badges/badge-category";
import { BadgeSubCategory } from "@/components/badges/badge-sub-category";
import { PreventionTip } from "./components/prevention-tip";

export const revalidate = 60;

const { NEXT_PUBLIC_ADSENSE_SLOT } = SERVER_ENVIRONMENT;

export async function generateMetadata({
  params,
}: TVideoPageProps): Promise<Metadata> {
  const { video, slug } = await getVideoBySlug(params);
  if (!video) return {};

  const description = `Veja como funcionou este golpe: ${video.title}`;
  return {
    title: video.title,
    description,
    alternates: { canonical: APP_ROUTE.FRAUDS.SLUG(slug) },
    openGraph: {
      type: "video.other",
      title: video.title,
      description,
      videos: [{ url: video.video_url }],
    },
  };
}

export default async function VideoPage({ params }: TVideoPageProps) {
  const { video, slug } = await getVideoBySlug(params);

  if (!video) return notFound();

  const otherRecentFrauds = await getOtherRecentVideos(video.id);

  return (
    <article className="mx-auto max-w-4xl px-4 py-10">
      <LdJsonScript video={video} />

      <Link
        href={APP_ROUTE.FRAUDS.ROOT}
        className="text-sm font-semibold underline"
      >
        Voltar para golpes sofridos
      </Link>

      <video
        src={video.video_url}
        controls
        preload="metadata"
        playsInline
        className="mt-4 aspect-video w-full bg-black"
      />

      <div className="py-4">
        {(video?.sub_category?.category?.name || video.sub_category?.name) && (
          <div className="mb-3 flex flex-wrap gap-2">
            {video?.sub_category?.category?.name && (
              <BadgeCategory>{video.sub_category.category.name}</BadgeCategory>
            )}

            {video?.sub_category?.name && (
              <BadgeSubCategory>{video.sub_category.name}</BadgeSubCategory>
            )}
          </div>
        )}

        {video?.title && (
          <h3 className="line-clamp-2 text-lg font-bold leading-snug">
            {video.title}
          </h3>
        )}

        {video?.description && (
          <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-ink/70">
            {video.description}
          </p>
        )}

        {video.updated_at && (
          <p className="mt-3 text-xs text-ink/60">
            Atualizado em {video.updated_at}
          </p>
        )}

        {video?.context && (
          <section className="border-t border-ink/15 py-6">
            <h2 className="font-display text-2xl font-bold">
              Contexto do golpe
            </h2>

            <p className="mt-3 whitespace-pre-line leading-relaxed text-ink/80">
              {video.context}
            </p>
          </section>
        )}

        {video?.content && (
          <section className="border-t border-ink/15 py-6">
            <h2 className="font-display text-2xl font-bold">
              Como o golpe funciona
            </h2>

            <div className="mt-3 whitespace-pre-line leading-relaxed text-ink/80">
              {video.content}
            </div>
          </section>
        )}

        {video.tips?.length > 0 && (
          <section className="border-t border-ink/15 py-6">
            <h2 className="font-display text-2xl font-bold">
              Como se proteger
            </h2>

            <ul className="mt-4 space-y-3">
              {video.tips.map((tip, index) => (
                <PreventionTip
                  key={`${tip.title}-${index}`}
                  index={index}
                  {...tip}
                />
              ))}
            </ul>
          </section>
        )}

        <Link
          href={generateWhatsAppShareLink({ videoTitle: video.title, slug })}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-block bg-ink px-5 py-3 font-bold text-sun hover:bg-black"
        >
          Compartilhar no WhatsApp
        </Link>
      </div>

      <AdsSlot slotNumber={NEXT_PUBLIC_ADSENSE_SLOT} />

      {otherRecentFrauds.length > 0 && (
        <section className="mt-10">
          <h2 className="mb-5 font-display text-3xl">Outros golpes</h2>

          <div className="grid gap-6 sm:grid-cols-3">
            {otherRecentFrauds.map((recentVideos) => (
              <PreviewCard key={recentVideos.id} video={recentVideos} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
