import type { MetadataRoute } from "next";
import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { serverDb } from "../lib/firebaseServer";

const SITE_URL = (process.env.SITE_URL || "https://faahadbhat.in").replace(
  /\/$/,
  ""
);

/** Slugs that map to App Router static segments and must not be listed as /[slug]. */
const RESERVED_PAGE_SLUGS = new Set(["blog", "page-generator"]);

function firestoreDate(value: unknown): Date | undefined {
  if (
    value &&
    typeof value === "object" &&
    "toDate" in value &&
    typeof (value as { toDate: () => Date }).toDate === "function"
  ) {
    return (value as { toDate: () => Date }).toDate();
  }
  return undefined;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: "daily", priority: 1.0 },
    { url: `${SITE_URL}/blog`, changeFrequency: "daily", priority: 0.8 },
  ];

  try {
    const [blogSnap, pagesSnap] = await Promise.all([
      getDocs(
        query(
          collection(serverDb, "blogPosts"),
          where("published", "==", true)
        )
      ),
      getDocs(collection(serverDb, "pages")),
    ]);

    // Blog routes use document id in the URL (see BlogPage links + getBlogPostById).
    const posts: MetadataRoute.Sitemap = blogSnap.docs.map((d) => {
      const data = d.data() as {
        date?: string;
        updatedAt?: unknown;
        createdAt?: unknown;
      };
      const lastModified =
        firestoreDate(data.updatedAt) ??
        (data.date ? new Date(data.date) : undefined) ??
        firestoreDate(data.createdAt);
      return {
        url: `${SITE_URL}/blog/${d.id}`,
        lastModified,
        changeFrequency: "weekly" as const,
        priority: 0.7,
      };
    });

    const generatedPages: MetadataRoute.Sitemap = pagesSnap.docs
      .map((d) => {
        const data = d.data() as {
          slug?: string;
          updatedAt?: unknown;
          createdAt?: unknown;
        };
        const slug =
          typeof data.slug === "string" ? data.slug.trim() : "";
        if (!slug || RESERVED_PAGE_SLUGS.has(slug)) return null;
        const lastModified =
          firestoreDate(data.updatedAt) ?? firestoreDate(data.createdAt);
        return {
          url: `${SITE_URL}/${encodeURIComponent(slug)}`,
          lastModified,
          changeFrequency: "monthly" as const,
          priority: 0.6,
        };
      })
      .filter((entry): entry is NonNullable<typeof entry> => entry !== null);

    return [...staticPages, ...posts, ...generatedPages];
  } catch {
    return staticPages;
  }
}
