import type { Metadata } from "next";
import { SERVER_ENVIRONMENT } from "@/environments/server.environment";
import { AdsSlot } from "@/libs/ads/components/ads-slot";
import { APP_ROUTE } from "@/routes/app.route";
import { generateWhatsAppShareLink } from "@/utils/generate/links";
import { LdJsonScript } from "@/components/scripts/ld-json";
import { PreviewCard } from "@/components/previews-cards/components/preview-card";
import { BadgeCategory } from "@/components/badges/badge-category";
import { BadgeSubCategory } from "@/components/badges/badge-sub-category";
import { RenderMarkdown } from "@/components/markdown/render-markdown";
import { ButtonLink } from "@/components/buttons/button-link";
import { IPageParamsProps } from "@/types/global.type";
import {
  getFraudBySlug,
  getOtherRecentFrauds,
} from "@/libs/supabase/frauds/get-frauds";
import { LawyerCard } from "./components/lawyer-card";
import { ButtonShare } from "@/components/buttons/button-share";
import { PreventionTip } from "@/components/tips/prevention-tip";

export const revalidate = 3600;

const { NEXT_PUBLIC_ADSENSE_SLOT } = SERVER_ENVIRONMENT;

export async function generateMetadata({
  params,
}: IPageParamsProps<{ slug?: string }>): Promise<Metadata> {
  const { slug } = await params;

  if (!slug) throw new Error("Parâmetro não encontrado");

  const { fraud } = await getFraudBySlug(slug);

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

export default async function FraudPublicPage({
  params,
}: IPageParamsProps<{ slug?: string }>) {
  const { slug } = await params;

  if (!slug) throw new Error("Parâmetro não encontrado");

  const { fraud, lawyer } = await getFraudBySlug(slug);

  const otherRecentFrauds = await getOtherRecentFrauds(fraud.id);

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <LdJsonScript fraud={fraud} />

      <ButtonLink variant="underline" href={APP_ROUTE.FRAUDS.ROOT()}>
        Voltar para golpes sofridos
      </ButtonLink>

      <div className="flex items-center justify-between gap-4 mt-3 ">
        {(fraud?.city || fraud?.state) && (
          <p className="text-sm text-ink/80">
            {fraud.city}
            {fraud.state && `, ${fraud.state}`}
          </p>
        )}

        {fraud.updated_at && (
          <p className="text-sm text-ink/80">
            Atualizado em {fraud.updated_at}
          </p>
        )}
      </div>

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

        {lawyer && (
          <LawyerCard
            {...lawyer}
            fraudSlug={fraud.slug}
            fraudTitle={fraud.title}
          />
        )}

        <div>
          <h4 className="text-lg font-semibold mb-2">Compartilhar</h4>

          <div className="grid grid-cols-2 sm:flex sm:items-center gap-4">
            <ButtonLink
              href={generateWhatsAppShareLink({
                title: fraud.title,
                slug,
                variant: "fraud",
              })}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-none"
            >
              WhatsApp
            </ButtonLink>

            <ButtonShare
              fraudTitle={fraud.title}
              slug={fraud.slug}
              variant="fraud"
            />
          </div>
        </div>
      </div>

      <AdsSlot slotNumber={NEXT_PUBLIC_ADSENSE_SLOT} />

      {otherRecentFrauds.length > 0 && (
        <section className="mt-10">
          <h2 className="mb-5 font-display text-3xl">Outros golpes</h2>

          <div className="grid gap-6 sm:grid-cols-3">
            {otherRecentFrauds.map((recentVideos) => (
              <PreviewCard
                key={recentVideos.id}
                preview={recentVideos}
                variant="fraud"
              />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
