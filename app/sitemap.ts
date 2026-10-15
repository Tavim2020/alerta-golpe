import type { MetadataRoute } from 'next';
import { getVideos, SITE } from '@/lib/server';

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const videos = await getVideos();
  return [
    { url: SITE, changeFrequency: 'daily', priority: 1 },
    { url: `${SITE}/golpes`, changeFrequency: 'daily', priority: 0.9 },
    ...videos.map((video) => ({
      url: `${SITE}/golpes/${video.slug}`,
      ...(video.created_at && { lastModified: video.created_at }),
    })),
  ];
}
