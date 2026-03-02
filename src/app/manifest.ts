
import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Farmekox: Smart Crop Advisory',
    short_name: 'Farmekox',
    description: 'AI-powered crop advisory system for farmers.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#288052',
    icons: [
      {
        src: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=192&h=192&fit=crop',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=512&h=512&fit=crop',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
