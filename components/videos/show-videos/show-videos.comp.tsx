import React from "react";
import { IShowVideosProps } from "./show-videos.type";
import { VideoCard } from "./components/video-card";

export const ShowVideos = ({ videos }: IShowVideosProps) => {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {videos.map((video) => (
        <VideoCard key={video.id} video={video} />
      ))}
    </div>
  );
};
