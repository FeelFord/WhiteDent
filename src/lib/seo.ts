import type { Metadata } from "next";

// Demo-only metadata: an approved domain and a separate launch review are required
// before canonical URLs, indexable sitemap entries or official clinic schema.
export function demoMetadata(title: string, description: string): Metadata {
  return {
    title,
    description,
    robots: { index: false, follow: false, nocache: true },
    openGraph: {
      title,
      description,
      siteName: "WhiteDent · Демонстрационная концепция",
      locale: "ru_KZ",
      type: "website",
    },
    twitter: { card: "summary", title, description },
  };
}
