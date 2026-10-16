import Script from "next/script";
import { LdJsonScriptProps } from "./ld-json.script.type";

export const LdJsonScript = ({ video }: LdJsonScriptProps) => {
  const ld = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: video.title,
    description: video.title,
    thumbnailUrl: video.thumbnail_url,
    uploadDate: video.created_at,
    contentUrl: video.video_url,
  };

  return (
    <Script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
    />
  );
};
