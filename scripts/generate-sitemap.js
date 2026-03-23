import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { properties } from '../src/data/properties.js'

const SITE_URL = 'https://unitedproperties.eu'
const TODAY = new Date().toISOString().split('T')[0]

const staticRoutes = [
  { path: '/', changefreq: 'daily', priority: '1.0' },
  { path: '/properties', changefreq: 'weekly', priority: '0.9' },
  { path: '/about', changefreq: 'monthly', priority: '0.6' },
  { path: '/contact', changefreq: 'monthly', priority: '0.6' },
]

const cityRoutes = [
  '/properties/limassol',
  '/properties/paphos',
  '/properties/nicosia',
  '/properties/larnaca',
  '/properties/protaras',
  '/properties/ayia-napa',
]

function buildUrl(pathname) {
  const normalizedPath = pathname.startsWith('/') ? pathname : `/${pathname}`
  return `${SITE_URL}${normalizedPath}`
}

function createUrlEntry({ loc, lastmod = TODAY, changefreq = 'weekly', priority = '0.8' }) {
  return `  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`
}

function uniqueByLoc(entries) {
  const seen = new Set()
  return entries.filter((entry) => {
    if (seen.has(entry.loc)) return false
    seen.add(entry.loc)
    return true
  })
}

function getPropertyEntries() {
  if (!Array.isArray(properties) || properties.length === 0) return []

  return properties
    .filter((property) => typeof property?.slug === 'string' && property.slug.trim().length > 0)
    .map((property) => ({
      loc: buildUrl(`/property/${property.slug}`),
      changefreq: 'weekly',
      priority: '0.7',
    }))
}

function generateSitemapXml() {
  const entries = [
    ...staticRoutes.map((route) => ({
      loc: buildUrl(route.path),
      changefreq: route.changefreq,
      priority: route.priority,
    })),
    ...cityRoutes.map((route) => ({
      loc: buildUrl(route),
      changefreq: 'weekly',
      priority: '0.8',
    })),
    ...getPropertyEntries(),
  ]

  const uniqueEntries = uniqueByLoc(entries)
  const xmlEntries = uniqueEntries.map(createUrlEntry).join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${xmlEntries}
</urlset>
`
}

function writeSitemap() {
  const __filename = fileURLToPath(import.meta.url)
  const __dirname = path.dirname(__filename)
  const outputPath = path.resolve(__dirname, '../public/sitemap.xml')
  const publicDir = path.dirname(outputPath)

  fs.mkdirSync(publicDir, { recursive: true })
  fs.writeFileSync(outputPath, generateSitemapXml(), 'utf8')

  console.log(`Sitemap generated at ${outputPath}`)
}

writeSitemap()
