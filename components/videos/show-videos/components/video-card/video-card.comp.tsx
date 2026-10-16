import Link from "next/link";
import { VideoCardProps } from "./video-card.type";
import { APP_ROUTE } from "@/routes/app.route";

export const VideoCard = ({ video }: VideoCardProps) => {
  return (
    <Link
      href={APP_ROUTE.FRAUDS.SLUG(video.slug)}
      className="group block border border-ink/15 bg-white transition hover:border-ink hover:shadow-[6px_6px_0_#ffd60a]"
    >
      <div className="relative aspect-video bg-ink">
        <video
          src={`${video.video_url}#t=0.5`}
          preload="metadata"
          muted
          playsInline
          className="h-full w-full object-cover"
        />

        <span className="absolute inset-0 grid place-items-center bg-black/25 text-3xl text-white transition group-hover:bg-black/10">
          ▶
        </span>
      </div>

      <div className="p-4">
        <h3 className="line-clamp-2 text-lg font-bold leading-snug">
          {video.title}
        </h3>

        <p className="mt-2 text-xs text-ink/60">{video.created_at}</p>
      </div>
    </Link>
  );
};
