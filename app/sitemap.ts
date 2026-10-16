import type { MetadataRoute } from "next";
import { getVideos } from "@/libs/supabase/server";
import { SERVER_ENVIRONMENT } from "@/environments/server.environment";

export const revalidate = 3600;

const { NEXT_PUBLIC_SITE_URL } = SERVER_ENVIRONMENT;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const videos = await getVideos();

  return [
    { url: NEXT_PUBLIC_SITE_URL, changeFrequency: "daily", priority: 1 },
    {
      url: `${NEXT_PUBLIC_SITE_URL}/golpes`,
      changeFrequency: "daily",
      priority: 0.9,
    },
    ...videos.map((video) => ({
      url: `${NEXT_PUBLIC_SITE_URL}/golpes/${video.title}`,
      ...(video.created_at && { lastModified: video.created_at }),
    })),
  ];
}
