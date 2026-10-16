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
import { VideoCard } from "@/components/videos/show-videos/components/video-card";

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
    <article className="mx-auto max-w-4xl px-4 py-8">
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

      <h1 className="mt-6 font-display text-4xl leading-tight sm:text-5xl">
        {video.title}
      </h1>

      <p className="mt-2 text-sm text-ink/60">{video.created_at}</p>

      <a
        href={generateWhatsAppShareLink({ videoTitle: video.title, slug })}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-6 inline-block bg-ink px-5 py-3 font-bold text-sun hover:bg-black"
      >
        Compartilhar no WhatsApp
      </a>

      <AdsSlot slotNumber={NEXT_PUBLIC_ADSENSE_SLOT} />

      {otherRecentFrauds.length > 0 && (
        <section className="mt-10">
          <h2 className="mb-5 font-display text-3xl">Outros golpes</h2>

          <div className="grid gap-6 sm:grid-cols-3">
            {otherRecentFrauds.map((recentVideos) => (
              <VideoCard key={recentVideos.id} video={recentVideos} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
