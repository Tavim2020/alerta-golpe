import { IPreviewVideosProps } from "./preview-videos-card.type";
import { PreviewCard } from "./components/preview-card";

export const PreviewVideosCard = ({ frauds }: IPreviewVideosProps) => {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {frauds.map((fraud) => (
        <PreviewCard key={fraud.id} fraud={fraud} />
      ))}
    </div>
  );
};
