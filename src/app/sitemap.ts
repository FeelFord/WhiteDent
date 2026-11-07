import type { MetadataRoute } from "next";

// No official domain is approved. Do not advertise demo URLs for indexing.
export default function sitemap(): MetadataRoute.Sitemap { return []; }
