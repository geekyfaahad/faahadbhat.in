 import { getPublishedBlogPosts } from '../../src/firebase/blogService.js';

const SITE_URL = process.env.SITE_URL || 'https://faahadbhat.in';

const xmlEscape = (str) =>
  String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

export async function handler() {
  try {
    const staticUrls = [
      { loc: `${SITE_URL}/`, changefreq: 'weekly', priority: 1.0 },
      { loc: `${SITE_URL}/blog`, changefreq: 'daily', priority: 0.9 }
    ];

    const posts = await getPublishedBlogPosts();

    const postUrls = (posts || []).map((p) => ({
      loc: `${SITE_URL}/blog/${p.id}`,
      lastmod: p.date ? new Date(p.date).toISOString().split('T')[0] : undefined,
      changefreq: 'monthly',
      priority: 0.7
    }));

    const urls = [...staticUrls, ...postUrls];

    const urlset = urls
      .map((u) => {
        const lastmodTag = u.lastmod ? `\n    <lastmod>${xmlEscape(u.lastmod)}</lastmod>` : '';
        return `  <url>\n    <loc>${xmlEscape(u.loc)}</loc>${lastmodTag}\n    <changefreq>${u.changefreq}</changefreq>\n    <priority>${u.priority}</priority>\n  </url>`;
      })
      .join('\n');

    const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urlset}\n</urlset>`;

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=300'
      },
      body
    };
  } catch (err) {
    const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url>\n    <loc>${xmlEscape(`${SITE_URL}/`)}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>1.0</priority>\n  </url>\n</urlset>`;
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/xml; charset=utf-8'
      },
      body
    };
  }
}


