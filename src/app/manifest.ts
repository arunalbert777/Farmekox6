import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Farmekox: Smart Crop Advisory',
    short_name: 'Farmekox',
    description: 'AI-powered crop advisory system for farmers.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#f97316',
    icons: [
      {
        src: 'https://picsum.photos/seed/farmekox-logo/192/192',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: 'https://picsum.photos/seed/farmekox-logo/512/512',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}