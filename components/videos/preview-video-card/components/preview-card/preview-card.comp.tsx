import Link from "next/link";
import { IPreviewCardProps } from "./preview-card.type";
import { APP_ROUTE } from "@/routes/app.route";
import Image from "next/image";
import { BadgeCategory } from "@/components/badges/badge-category";
import { BadgeSubCategory } from "@/components/badges/badge-sub-category";
import { ContentUnavailable } from "@/components/videos/content-unavailable";

export const PreviewCard = ({ video }: IPreviewCardProps) => {
  if (!video?.slug) return null;

  return (
    <Link
      href={APP_ROUTE.FRAUDS.SLUG(video.slug)}
      className="group block border border-ink/15 bg-white transition hover:border-ink hover:shadow-[6px_6px_0_#ffd60a]"
    >
      <div className="relative aspect-video bg-ink">
        {video?.thumbnail_url ? (
          <Image
            src={video.thumbnail_url}
            alt={video.title}
            width={200}
            height={200}
            className="h-full w-full object-cover"
          />
        ) : (
          <ContentUnavailable />
        )}

        <span className="absolute inset-0 grid place-items-center bg-black/25 text-3xl text-white transition group-hover:bg-black/10">
          ▶
        </span>
      </div>

      <div className="p-4">
        {(video?.sub_category?.category?.name || video?.sub_category?.name) && (
          <div className="mb-3 flex flex-wrap gap-2">
            {video.sub_category?.category?.name && (
              <BadgeCategory>{video.sub_category.category.name}</BadgeCategory>
            )}

            {video.sub_category?.name && (
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

        {video?.updated_at && (
          <p className="mt-3 text-xs text-ink/60">
            Atualizado em {video.updated_at}
          </p>
        )}
      </div>
    </Link>
  );
};
