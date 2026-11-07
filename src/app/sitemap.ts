import type { MetadataRoute } from "next";

export const dynamic = "force-static";

// No official domain is approved. Do not advertise demo URLs for indexing.
export default function sitemap(): MetadataRoute.Sitemap { return []; }
