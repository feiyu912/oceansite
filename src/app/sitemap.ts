import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://oceansite.example.com";
  return [
    { url: `${base}/`, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${base}/currents`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/species`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/reef`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
  ];
}


