import type { MetadataRoute } from "next";
import { getFrauds } from "@/libs/supabase/frauds/get-frauds";
import { SERVER_ENVIRONMENT } from "@/environments/server.environment";
import { APP_ROUTE } from "@/routes/app.route";

export const revalidate = 3600;

const { NEXT_PUBLIC_SITE_URL } = SERVER_ENVIRONMENT;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { data: frauds, success } = await getFrauds({ limit: 50 });

  if (!success) {
    throw new Error("Tivemos problemas ao buscar os golpes.");
  }

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: NEXT_PUBLIC_SITE_URL,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${NEXT_PUBLIC_SITE_URL}${APP_ROUTE.FRAUDS.ROOT()}`,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${NEXT_PUBLIC_SITE_URL}${APP_ROUTE.ABOUT.ROOT}`,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${NEXT_PUBLIC_SITE_URL}${APP_ROUTE.TERMS_OF_USE.ROOT}`,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${NEXT_PUBLIC_SITE_URL}${APP_ROUTE.PRIVACY_POLICY.ROOT}`,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  const fraudPages: MetadataRoute.Sitemap = frauds.map((fraud) => ({
    url: `${NEXT_PUBLIC_SITE_URL}${APP_ROUTE.FRAUDS.SLUG(fraud.slug)}`,
    ...(fraud.updated_at && {
      lastModified: fraud.updated_at,
    }),
  }));

  return [...staticPages, ...fraudPages];
}
