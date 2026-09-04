export default function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://realhumantrust.org'

  const routes = [
    '',
    '/about',
    '/donate',
    '/membership',
    '/events',
    '/projects',
    '/crowdfunding',
    '/news',
    '/gallery',
    '/contact',
    '/team',
    '/downloads',
    '/reports',
    '/objectives',
    '/vision-mission',
    '/founder-message',
    '/testimonials',
    '/awards',
    '/privacy-policy',
    '/terms',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: route === '' ? 'daily' : 'weekly',
    priority: route === '' ? 1.0 : route === '/donate' || route === '/membership' ? 0.9 : 0.8,
  }))

  return routes
}
