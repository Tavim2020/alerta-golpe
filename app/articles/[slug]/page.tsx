import type { Metadata } from "next";
import { SERVER_ENVIRONMENT } from "@/environments/server.environment";
import { AdsSlot } from "@/libs/ads/components/ads-slot";
import { APP_ROUTE } from "@/routes/app.route";
import { generateWhatsAppShareLink } from "@/utils/generate/links";
import { PreventionTip } from "../../../components/tips/prevention-tip";
import { RenderMarkdown } from "@/components/markdown/render-markdown";
import { ButtonLink } from "@/components/buttons/button-link";
import { IPageParamsProps } from "@/types/global.type";
import { ButtonShare } from "../../../components/buttons/button-share";
import { getArticlesBySlug } from "@/libs/supabase/articles/get-articles";
import Image from "next/image";

export const revalidate = 3600;

const { NEXT_PUBLIC_ADSENSE_SLOT } = SERVER_ENVIRONMENT;

export async function generateMetadata({
  params,
}: IPageParamsProps<{ slug?: string }>): Promise<Metadata> {
  const { slug } = await params;

  if (!slug) throw new Error("Parâmetro não encontrado");

  const { article } = await getArticlesBySlug(slug);

  if (!article) return {};

  const description = `Veja este artigo: ${article.title}`;
  return {
    title: article.title,
    description,
    alternates: { canonical: APP_ROUTE.ARTICLES.SLUG(slug) },
    openGraph: {
      title: article.title,
      description,
      images: [
        {
          url: article.thumbnail_url,
        },
      ],
    },
  };
}

export default async function ArticlePublicPage({
  params,
}: IPageParamsProps<{ slug?: string }>) {
  const { slug } = await params;

  if (!slug) throw new Error("Parâmetro não encontrado");

  const { article } = await getArticlesBySlug(slug);

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <ButtonLink variant="underline" href={APP_ROUTE.HOME.ROOT}>
        Voltar para home
      </ButtonLink>

      <div className="flex items-center justify-between gap-4 mt-3 ">
        {article.updated_at && (
          <p className="text-sm text-ink/80">
            Atualizado em {article.updated_at}
          </p>
        )}
      </div>

      <Image
        src={article.thumbnail_url}
        alt={article.title}
        width={1280}
        height={720}
        className="mt-4 aspect-video w-full bg-black object-fit-cover"
      />

      <div className="py-4">
        {article?.title && (
          <h1 className="text-2xl font-bold leading-tight tracking-tight sm:text-3xl">
            {article.title}
          </h1>
        )}

        {article?.description && (
          <p className="mt-3 text-base leading-7 text-ink/70 sm:text-lg sm:leading-8">
            {article.description}
          </p>
        )}

        {article?.context && (
          <section className="border-t border-ink/15 py-6">
            <h2 className="mb-5 font-display text-2xl font-bold leading-tight tracking-tight sm:text-3xl">
              Contexto
            </h2>

            <RenderMarkdown>{article.context}</RenderMarkdown>
          </section>
        )}

        {article?.content && (
          <section className="border-t border-ink/15 py-6">
            <h2 className="mb-5 font-display text-2xl font-bold leading-tight tracking-tight sm:text-3xl">
              Conteúdo
            </h2>

            <RenderMarkdown>{article.content}</RenderMarkdown>
          </section>
        )}

        {article.tips?.length > 0 && (
          <section className="border-t border-ink/15 py-6">
            <h2 className="mb-5 font-display text-2xl font-bold leading-tight tracking-tight sm:text-3xl">
              Dicas extras
            </h2>

            <ul className="mt-4 space-y-3">
              {article.tips.map((tip, index) => (
                <PreventionTip
                  key={`${tip.title}-${index}`}
                  index={index}
                  {...tip}
                />
              ))}
            </ul>
          </section>
        )}

        <div>
          <h4 className="text-lg font-semibold mb-2">Compartilhar</h4>

          <div className="grid grid-cols-2 sm:flex sm:items-center gap-4">
            <ButtonLink
              href={generateWhatsAppShareLink({
                title: article.title,
                slug,
                variant: "article",
              })}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-none"
            >
              WhatsApp
            </ButtonLink>

            <ButtonShare
              fraudTitle={article.title}
              slug={article.slug}
              variant="article"
            />
          </div>
        </div>
      </div>

      <AdsSlot slotNumber={NEXT_PUBLIC_ADSENSE_SLOT} />
    </main>
  );
}
