import type { MetadataRoute } from "next";
import { collection, getDocs, query, where } from "firebase/firestore";
import { serverDb } from "../lib/firebaseServer";

const SITE_URL = process.env.SITE_URL || "https://faahadbhat.in";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: "daily", priority: 1.0 },
    { url: `${SITE_URL}/blog`, changeFrequency: "daily", priority: 0.8 },
  ];

  try {
    const snap = await getDocs(
      query(collection(serverDb, "blogPosts"), where("published", "==", true))
    );
    const posts = snap.docs.map((d) => {
      const data = d.data() as { slug?: string; date?: string };
      return {
        url: `${SITE_URL}/blog/${data.slug || d.id}`,
        lastModified: data.date ? new Date(data.date) : undefined,
        changeFrequency: "weekly" as const,
        priority: 0.7,
      };
    });
    return [...staticPages, ...posts];
  } catch {
    return staticPages;
  }
}
