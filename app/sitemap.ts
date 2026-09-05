import { MetadataRoute } from 'next'

const validTools = [
  "pdf-to-word", "word-to-pdf", "compress-pdf", "merge-pdf", "split-pdf",
  "jpg-to-png", "png-to-jpg", "compress-image",
  "mp4-to-mp3", "wav-to-mp3", "compress-video",
  "ai-summarize", "protect-pdf"
];

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://converthub.com'
  
  // Static routes
  const routes = [
    '',
    '/tools',
    '/pricing',
    '/login',
    '/signup',
    '/about',
    '/faq'
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  // Dynamic tool routes
  const toolRoutes = validTools.map((tool) => ({
    url: `${baseUrl}/${tool}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }))

  return [...routes, ...toolRoutes]
}
