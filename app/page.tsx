import Link from 'next/link';
import AdSlot from '@/components/AdSlot';
import VideoCard from '@/components/VideoCard';
import { getVideos } from '@/lib/server';

export const revalidate = 60;
export const metadata = { alternates: { canonical: '/' } };

export default async function Home() {
  const videos = await getVideos(12);
  return (
    <>
      <section className="bg-sun">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:py-20">
          <h1 className="max-w-3xl font-display text-5xl leading-[1.05] sm:text-7xl">Esses golpes já aconteceram. Não deixe que o próximo seja com você.</h1>
          <p className="mt-5 max-w-xl text-lg">Vídeos reais de pessoas que caíram em golpes. Veja como os criminosos agem e proteja sua família.</p>
          <Link href="/golpes" className="mt-8 inline-block bg-ink px-6 py-3 font-bold text-sun hover:bg-black">Ver golpes sofridos</Link>
        </div>
        <div className="hazard" />
      </section>
      <div className="mx-auto max-w-6xl px-4">
        <AdSlot />
        <h2 className="mb-5 font-display text-3xl">Últimos golpes</h2>
        {videos.length ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{videos.map((v) => <VideoCard key={v.id} v={v} />)}</div>
        ) : (
          <p className="border border-ink/15 bg-white p-8 text-center">Nenhum vídeo publicado ainda. Volte em breve.</p>
        )}
        <AdSlot />
      </div>
    </>
  );
}
