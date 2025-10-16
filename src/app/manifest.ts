import { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'UrbanEzii - Your Local Service Bridge',
    short_name: 'UrbanEzii',
    description: 'Discover, book, and manage verified professionals for every home need.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#2B85FF',
    icons: [
      {
        src: '/logo.png',
        sizes: 'any',
        type: 'image/png',
      },
    ],
  }
}

