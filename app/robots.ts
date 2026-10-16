import type { MetadataRoute } from "next";
import { SERVER_ENVIRONMENT } from "@/environments/server.environment";

const { NEXT_PUBLIC_SITE_URL } = SERVER_ENVIRONMENT;

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/acesso-adm", "/api/"],
    },
    sitemap: `${NEXT_PUBLIC_SITE_URL}/sitemap.xml`,
  };
}
