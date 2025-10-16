import { MetadataRoute } from 'next'
 
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/provider/', '/api/'],
    },
    sitemap: 'https://urbanezii.com/sitemap.xml',
  }
}

