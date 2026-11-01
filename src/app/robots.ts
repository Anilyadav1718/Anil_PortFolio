import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://anilpanchitha.dev';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/admin', '/admin/'],
    },
    sitemap: `${appUrl}/sitemap.xml`,
  };
}

