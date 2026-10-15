import type { Metadata } from 'next';
import AdSlot from '@/components/AdSlot';
import VideoCard from '@/components/VideoCard';
import { getVideos } from '@/lib/server';

export const revalidate = 60;
export const metadata: Metadata = {
  title: 'Golpes sofridos',
  description: 'Relatos em vídeo de golpes reais: PIX, WhatsApp, falsa central, boletos e mais. Aprenda a reconhecer cada um.',
  alternates: { canonical: '/golpes' },
};

const dicas = [
  ['Desconfie da pressa', 'Golpistas criam urgência para você não pensar. Pare e confirme antes de agir.'],
  ['Nunca passe códigos', 'Códigos de SMS, WhatsApp e do banco são a chave da sua conta. Ninguém legítimo pede.'],
  ['Confirme por outro canal', 'Desligue e ligue para o número oficial da empresa ou fale com a pessoa pessoalmente.'],
];

export default async function Golpes() {
  const videos = await getVideos();
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="font-display text-5xl">Golpes sofridos</h1>
      <p className="mt-3 max-w-2xl text-lg">Cada vídeo mostra um golpe que realmente aconteceu. Compartilhe com quem você quer proteger.</p>
      <ul className="mt-8 grid gap-4 md:grid-cols-3">
        {dicas.map(([title, description]) => (
          <li key={title} className="border-l-8 border-sun bg-white p-4">
            <h2 className="font-bold">{title}</h2>
            <p className="mt-1 text-sm text-ink/70">{description}</p>
          </li>
        ))}
      </ul>
      <AdSlot />
      {videos.length ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{videos.map((v) => <VideoCard key={v.id} v={v} />)}</div>
      ) : (
        <p className="border border-ink/15 bg-white p-8 text-center">Nenhum vídeo publicado ainda.</p>
      )}
    </div>
  );
}
