import { IPreviewsCardsProps } from "./previews-cards.type";
import { PreviewCard } from "./components/preview-card";

export const PreviewsCards = ({ previews, variant }: IPreviewsCardsProps) => {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {previews.map((preview) => (
        <PreviewCard key={preview.id} preview={preview} variant={variant} />
      ))}
    </div>
  );
};
