import type { MetadataRoute } from 'next';
import { SITE } from '@/lib/server';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/admin', '/acesso-adm', '/api/'] },
    sitemap: `${SITE}/sitemap.xml`,
  };
}
