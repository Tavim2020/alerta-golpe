import Link from "next/link";
import { IPreviewCardProps } from "./preview-card.type";
import { APP_ROUTE } from "@/routes/app.route";
import Image from "next/image";
import { BadgeCategory } from "@/components/badges/badge-category";
import { BadgeSubCategory } from "@/components/badges/badge-sub-category";
import { ContentUnavailable } from "@/components/videos/content-unavailable";

export const PreviewCard = ({ fraud }: IPreviewCardProps) => {
  if (!fraud?.slug) return null;

  return (
    <Link
      href={APP_ROUTE.FRAUDS.SLUG(fraud.slug)}
      className="group block border border-ink/15 bg-white transition hover:border-ink hover:shadow-[6px_6px_0_#ffd60a]"
    >
      <div className="relative aspect-video bg-ink">
        {fraud?.thumbnail_url ? (
          <Image
            src={fraud.thumbnail_url}
            alt={fraud.title}
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
        {(fraud?.sub_category?.category?.name || fraud?.sub_category?.name) && (
          <div className="mb-3 flex flex-wrap gap-2">
            {fraud.sub_category?.category?.name && (
              <BadgeCategory>{fraud.sub_category.category.name}</BadgeCategory>
            )}

            {fraud.sub_category?.name && (
              <BadgeSubCategory>{fraud.sub_category.name}</BadgeSubCategory>
            )}
          </div>
        )}

        {fraud?.title && (
          <h3 className="line-clamp-2 text-lg font-bold leading-snug">
            {fraud.title}
          </h3>
        )}

        {fraud?.description && (
          <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-ink/70">
            {fraud.description}
          </p>
        )}

        {fraud?.updated_at && (
          <p className="mt-3 text-xs text-ink/60">
            Atualizado em {fraud.updated_at}
          </p>
        )}
      </div>
    </Link>
  );
};
