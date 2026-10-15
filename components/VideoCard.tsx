import Link from 'next/link';
import type { Video } from '@/lib/types';

type VideoCardProps = {
  v: Video;
};

export default function VideoCard({ v }: VideoCardProps) {
  return (
    <Link href={`/golpes/${v.slug}`} className="group block border border-ink/15 bg-white transition hover:border-ink hover:shadow-[6px_6px_0_#ffd60a]">
      <div className="relative aspect-video bg-ink">
        <video src={`${v.video_url}#t=0.5`} preload="metadata" muted playsInline className="h-full w-full object-cover" />
        <span className="absolute inset-0 grid place-items-center bg-black/25 text-3xl text-white transition group-hover:bg-black/10">▶</span>
      </div>
      <div className="p-4">
        <h3 className="line-clamp-2 text-lg font-bold leading-snug">{v.title}</h3>
        {v.created_at && <p className="mt-2 text-xs text-ink/60">{new Date(v.created_at).toLocaleDateString('pt-BR')}</p>}
      </div>
    </Link>
  );
}
