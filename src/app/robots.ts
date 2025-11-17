import { MetadataRoute } from 'next'
 
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/provider/', '/api/', '/login'],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/admin/', '/provider/', '/api/', '/login'],
      },
    ],
    sitemap: 'https://urbanezii.com/sitemap.xml',
  }
}

