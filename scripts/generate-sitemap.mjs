import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const SITE_URL = process.env.SITE_URL || 'https://faahadbhat.in';
const FIREBASE_PROJECT = 'faahad-blog';
const COLLECTION = 'blogPosts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const publicDir = path.resolve(__dirname, '..', 'public');
const outFile = path.join(publicDir, 'sitemap.xml');

fs.mkdirSync(publicDir, { recursive: true });

function xmlEscape(s) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

async function fetchPublishedPostsREST() {
  const url = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT}/databases/(default)/documents:runQuery`;
  const body = {
    structuredQuery: {
      from: [{ collectionId: COLLECTION }],
      where: {
        fieldFilter: {
          field: { fieldPath: 'published' },
          op: 'EQUAL',
          value: { booleanValue: true },
        },
      }
      // No orderBy here to avoid requiring a composite index
    },
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    console.warn('Failed to query Firestore. Status:', res.status);
    return [];
  }

  const lines = await res.json();
  let posts = [];
  for (const row of lines) {
    if (!row.document) continue;
    const docName = row.document.name;
    const id = docName.split('/').pop();
    const f = row.document.fields || {};
    posts.push({
      id,
      slug: f.slug?.stringValue || null,
      title: f.title?.stringValue || null,
      excerpt: f.excerpt?.stringValue || null,
      date: f.date?.stringValue || f.date?.timestampValue || null,
      updatedAt: f.updatedAt?.timestampValue || null,
    });
  }
  // Sort client-side by date desc if available
  posts.sort((a, b) => (new Date(b.date || 0)) - (new Date(a.date || 0)));
  return posts;
}

async function fetchPublishedPostsSDK() {
  try {
    // Lazy import to avoid affecting Node startup when not needed
    const { collection, getDocs, getFirestore, orderBy, query, where } = await import('firebase/firestore');
    const { initializeApp } = await import('firebase/app');

    // Mirror src/firebase/config.js values
    const firebaseConfig = {
      apiKey: 'AIzaSyA6zgjEBYI5Aw7ez2cG7o7kWk-xaznQ-fo',
      authDomain: 'faahad-blog.firebaseapp.com',
      projectId: 'faahad-blog',
      storageBucket: 'faahad-blog.firebasestorage.app',
      messagingSenderId: '1071658490147',
      appId: '1:1071658490147:web:2d0703e784956c3b9a1496',
      measurementId: 'G-MMNQLY1955',
    };

    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    // Try with orderBy, if Firestore demands an index, retry without
    let snap;
    try {
      const q1 = query(
        collection(db, COLLECTION),
        where('published', '==', true),
        orderBy('date', 'desc'),
      );
      snap = await getDocs(q1);
    } catch (e) {
      const q2 = query(collection(db, COLLECTION), where('published', '==', true));
      snap = await getDocs(q2);
    }
    const posts = [];
    snap.forEach((doc) => {
      const f = doc.data() || {};
      posts.push({
        id: doc.id,
        slug: f.slug || null,
        title: f.title || null,
        excerpt: f.excerpt || null,
        date: f.date || null,
        updatedAt: f.updatedAt || null,
      });
    });
    return posts;
  } catch (e) {
    console.warn('SDK fetch fallback failed:', e?.message || e);
    return [];
  }
}

function urlTag(loc, lastmod, priority = '0.6', changefreq = 'weekly', meta) {
  const mod = lastmod ? new Date(lastmod).toISOString() : undefined;
  const title = meta?.title ? `    <title>${xmlEscape(meta.title)}</title>\n` : '';
  const desc = meta?.excerpt ? `    <description>${xmlEscape(meta.excerpt)}</description>\n` : '';
  return `  <url>\n    <loc>${xmlEscape(loc)}</loc>\n${mod ? `    <lastmod>${mod}</lastmod>\n` : ''}${title}${desc}    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
}

async function main() {
  const staticPages = [
    '/',
    '/blog',
  ];

  let posts = await fetchPublishedPostsREST();
  if (!posts.length) {
    posts = await fetchPublishedPostsSDK();
  }
  // Dedupe by slug/id
  const seen = new Set();
  posts = posts.filter((p) => {
    const key = (p.slug || p.id);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  const urls = [];
  for (const p of staticPages) {
    urls.push(urlTag(`${SITE_URL}${p}`, undefined, p === '/' ? '1.0' : '0.8', 'daily'));
  }

  for (const post of posts) {
    const handle = post.slug || post.id;
    urls.push(urlTag(`${SITE_URL}/blog/${handle}`, post.updatedAt || post.date || undefined, '0.7', 'weekly', { title: post.title, excerpt: post.excerpt }));
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    urls.join('\n') +
    `\n</urlset>\n`;

  fs.writeFileSync(outFile, xml, 'utf8');
  console.log('Sitemap written to', outFile);
}

main().catch((e) => {
  console.error('Failed to generate sitemap:', e);
  process.exit(1);
});


