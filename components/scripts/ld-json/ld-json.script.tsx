import Script from "next/script";
import { LdJsonScriptProps } from "./ld-json.script.type";

export const LdJsonScript = ({ fraud }: LdJsonScriptProps) => {
  const ld = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: fraud.title,
    description: fraud.title,
    thumbnailUrl: fraud.thumbnail_url,
    uploadDate: fraud.created_at,
    contentUrl: fraud.video_url,
  };

  return (
    <Script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
    />
  );
};
