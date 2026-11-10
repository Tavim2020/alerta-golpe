import { APP_ROUTE } from "@/routes/app.route";
import { TPreviewCardVariant } from "../preview-card.type";

interface IPreviewCardVariantProps {
  href: (slug: string) => string;
  isVideo: boolean;
}

export const previewCardVariants: Record<
  TPreviewCardVariant,
  IPreviewCardVariantProps
> = {
  article: {
    href: (slug) => APP_ROUTE.ARTICLES.SLUG(slug),
    isVideo: false,
  },
  fraud: {
    href: (slug) => APP_ROUTE.FRAUDS.SLUG(slug),
    isVideo: true,
  },
};
