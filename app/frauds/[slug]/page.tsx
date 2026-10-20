import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { SERVER_ENVIRONMENT } from "@/environments/server.environment";
import { AdsSlot } from "@/libs/ads/components/ads-slot";
import { APP_ROUTE } from "@/routes/app.route";
import { getFraudBySlug } from "@/utils/frauds/get-fraud-by-slug";
import { generateWhatsAppShareLink } from "@/utils/generate/links";
import { LdJsonScript } from "@/components/scripts/ld-json";
import { getOtherRecentFrauds } from "./utils/get-other-recent-frauds";
import { PreviewCard } from "@/components/videos/preview-video-card/components/preview-card";
import { BadgeCategory } from "@/components/badges/badge-category";
import { BadgeSubCategory } from "@/components/badges/badge-sub-category";
import { PreventionTip } from "./components/prevention-tip";
import { RenderMarkdown } from "./components/render-markdown";
import { ButtonLink } from "@/components/buttons/button-link";
import { TSlugPageProps } from "@/types/global.type";

export const revalidate = 3600;

const { NEXT_PUBLIC_ADSENSE_SLOT } = SERVER_ENVIRONMENT;

export async function generateMetadata({
  params,
}: TSlugPageProps): Promise<Metadata> {
  const { fraud, slug } = await getFraudBySlug(params);
  if (!fraud) return {};

  const description = `Veja como funcionou este golpe: ${fraud.title}`;
  return {
    title: fraud.title,
    description,
    alternates: { canonical: APP_ROUTE.FRAUDS.SLUG(slug) },
    openGraph: {
      type: "video.other",
      title: fraud.title,
      description,
      videos: [{ url: fraud.video_url }],
    },
  };
}

export default async function VideoPage({ params }: TSlugPageProps) {
  const { fraud, slug } = await getFraudBySlug(params);

  if (!fraud) return notFound();

  const otherRecentFrauds = await getOtherRecentFrauds(fraud.id);

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <LdJsonScript fraud={fraud} />

      <ButtonLink variant="underline" href={APP_ROUTE.FRAUDS.ROOT()}>
        Voltar para golpes sofridos
      </ButtonLink>

      {fraud.updated_at && (
        <p className="mt-3 text-xs text-ink/60">
          Atualizado em {fraud.updated_at}
        </p>
      )}

      <video
        src={fraud.video_url}
        controls
        preload="metadata"
        playsInline
        className="mt-4 aspect-video w-full bg-black"
      />

      <div className="py-4">
        {(fraud?.sub_category?.category?.name || fraud.sub_category?.name) && (
          <div className="mb-3 flex flex-wrap gap-2">
            {fraud?.sub_category?.category?.name && (
              <BadgeCategory>{fraud.sub_category.category.name}</BadgeCategory>
            )}

            {fraud?.sub_category?.name && (
              <BadgeSubCategory>{fraud.sub_category.name}</BadgeSubCategory>
            )}
          </div>
        )}

        {fraud?.title && (
          <h1 className="text-2xl font-bold leading-tight tracking-tight sm:text-3xl">
            {fraud.title}
          </h1>
        )}

        {fraud?.description && (
          <p className="mt-3 text-base leading-7 text-ink/70 sm:text-lg sm:leading-8">
            {fraud.description}
          </p>
        )}

        {fraud?.context && (
          <section className="border-t border-ink/15 py-6">
            <h2 className="mb-5 font-display text-2xl font-bold leading-tight tracking-tight sm:text-3xl">
              Contexto do golpe
            </h2>

            <RenderMarkdown>{fraud.context}</RenderMarkdown>
          </section>
        )}

        {fraud?.content && (
          <section className="border-t border-ink/15 py-6">
            <h2 className="mb-5 font-display text-2xl font-bold leading-tight tracking-tight sm:text-3xl">
              Como o golpe funciona
            </h2>

            <RenderMarkdown>{fraud.content}</RenderMarkdown>
          </section>
        )}

        {fraud.tips?.length > 0 && (
          <section className="border-t border-ink/15 py-6">
            <h2 className="mb-5 font-display text-2xl font-bold leading-tight tracking-tight sm:text-3xl">
              Como se proteger
            </h2>

            <ul className="mt-4 space-y-3">
              {fraud.tips.map((tip, index) => (
                <PreventionTip
                  key={`${tip.title}-${index}`}
                  index={index}
                  {...tip}
                />
              ))}
            </ul>
          </section>
        )}

        <ButtonLink
          href={generateWhatsAppShareLink({ fraudTitle: fraud.title, slug })}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6"
        >
          Compartilhar no WhatsApp
        </ButtonLink>
      </div>

      <AdsSlot slotNumber={NEXT_PUBLIC_ADSENSE_SLOT} />

      {otherRecentFrauds.length > 0 && (
        <section className="mt-10">
          <h2 className="mb-5 font-display text-3xl">Outros golpes</h2>

          <div className="grid gap-6 sm:grid-cols-3">
            {otherRecentFrauds.map((recentVideos) => (
              <PreviewCard key={recentVideos.id} fraud={recentVideos} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
