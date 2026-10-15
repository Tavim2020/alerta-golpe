import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import AdSlot from '@/components/AdSlot';
import VideoCard from '@/components/VideoCard';
import { getVideo, getVideos, SITE } from '@/lib/server';

export const revalidate = 60;

type VideoPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: VideoPageProps): Promise<Metadata> {
  const { slug } = await params;
  const video = await getVideo(slug);
  if (!video) return {};

  const description = video.description?.slice(0, 160) || `Veja como funcionou este golpe: ${video.title}`;
  return {
    title: video.title,
    description,
    alternates: { canonical: `/golpes/${slug}` },
    openGraph: { type: 'video.other', title: video.title, description, videos: [{ url: video.video_url }] },
  };
}

export default async function VideoPage({ params }: VideoPageProps) {
  const { slug } = await params;
  const video = await getVideo(slug);
  if (!video) notFound();

  const outros = (await getVideos(4)).filter((other) => other.id !== video.id).slice(0, 3);
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: video.title,
    description: video.description || video.title,
    uploadDate: video.created_at,
    contentUrl: video.video_url,
  };
  const share = `https://wa.me/?text=${encodeURIComponent(`${video.title} ${SITE}/golpes/${video.slug}`)}`;

  return (
    <article className="mx-auto max-w-4xl px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <Link href="/golpes" className="text-sm font-semibold underline">Voltar para golpes sofridos</Link>
      <video src={video.video_url} controls preload="metadata" playsInline className="mt-4 aspect-video w-full bg-black" />
      <h1 className="mt-6 font-display text-4xl leading-tight sm:text-5xl">{video.title}</h1>
      {video.created_at && <p className="mt-2 text-sm text-ink/60">{new Date(video.created_at).toLocaleDateString('pt-BR')}</p>}
      {video.description && <p className="mt-5 max-w-2xl whitespace-pre-line text-lg leading-relaxed">{video.description}</p>}
      <a href={share} target="_blank" rel="noopener noreferrer" className="mt-6 inline-block bg-ink px-5 py-3 font-bold text-sun hover:bg-black">Compartilhar no WhatsApp</a>
      <AdSlot />
      {outros.length > 0 && (
        <section className="mt-10">
          <h2 className="mb-5 font-display text-3xl">Outros golpes</h2>
          <div className="grid gap-6 sm:grid-cols-3">{outros.map((other) => <VideoCard key={other.id} v={other} />)}</div>
        </section>
      )}
    </article>
  );
}
