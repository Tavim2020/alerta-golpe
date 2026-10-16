import { IPreviewVideosProps } from "./preview-videos-card.type";
import { PreviewCard } from "./components/preview-card";

export const PreviewVideosCard = ({ videos }: IPreviewVideosProps) => {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {videos.map((video) => (
        <PreviewCard key={video.id} video={video} />
      ))}
    </div>
  );
};
