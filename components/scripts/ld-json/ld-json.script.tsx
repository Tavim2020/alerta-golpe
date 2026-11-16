import Script from "next/script";
import { LdJsonScriptProps } from "./ld-json.script.type";
import { parseLastModified } from "@/utils/format/dates";

export const LdJsonScript = ({ fraud }: LdJsonScriptProps) => {
  const ld = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: fraud.title,
    description: fraud.title,
    thumbnailUrl: fraud.thumbnail_url,
    uploadDate: parseLastModified(fraud.updated_at),
    contentUrl: fraud.video_url,
  };

  return (
    <Script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
    />
  );
};
