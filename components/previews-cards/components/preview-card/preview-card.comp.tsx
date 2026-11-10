import { IPreviewCardProps } from "./preview-card.type";
import Image from "next/image";
import { BadgeCategory } from "@/components/badges/badge-category";
import { BadgeSubCategory } from "@/components/badges/badge-sub-category";
import { ContentUnavailable } from "@/components/videos/content-unavailable";
import { ButtonLink } from "@/components/buttons/button-link";
import { previewCardVariants } from "./constants/preview-card.constant";

export const PreviewCard = ({
  preview,
  variant = "fraud",
}: IPreviewCardProps) => {
  if (!preview?.slug) return null;

  const { href, isVideo } = previewCardVariants[variant];

  return (
    <ButtonLink
      variant="clean"
      href={href(preview.slug)}
      className="group block border border-ink/15 bg-white transition hover:border-ink hover:shadow-[6px_6px_0_#ffd60a]"
    >
      <div className="relative aspect-video bg-ink">
        {preview?.thumbnail_url && preview.title ? (
          <Image
            src={preview.thumbnail_url}
            alt={preview.title}
            width={200}
            height={200}
            className="h-full w-full object-cover"
          />
        ) : (
          <ContentUnavailable />
        )}

        {isVideo && (
          <span className="absolute inset-0 grid place-items-center bg-black/25 text-3xl text-white transition group-hover:bg-black/10">
            ▶
          </span>
        )}
      </div>

      <div className="p-4">
        {(preview?.sub_category?.category?.name ||
          preview?.sub_category?.name) && (
          <div className="mb-3 flex flex-wrap gap-2">
            {preview.sub_category?.category?.name && (
              <BadgeCategory>
                {preview.sub_category.category.name}
              </BadgeCategory>
            )}

            {preview.sub_category?.name && (
              <BadgeSubCategory>{preview.sub_category.name}</BadgeSubCategory>
            )}
          </div>
        )}

        {preview?.title && (
          <h3 className="line-clamp-2 text-lg font-bold text-wrap leading-snug">
            {preview.title}
          </h3>
        )}

        {preview?.description && (
          <p className="mt-2 line-clamp-3 text-wrap text-sm leading-relaxed text-ink/70">
            {preview.description}
          </p>
        )}

        {preview?.updated_at && (
          <p className="mt-3 text-xs text-ink/60">
            Atualizado em {preview.updated_at}
          </p>
        )}

        {(preview?.city || preview?.state) && (
          <p className="mt-1 text-xs text-ink/60">
            {preview.city}
            {preview.state && `, ${preview.state}`}
          </p>
        )}
      </div>
    </ButtonLink>
  );
};
