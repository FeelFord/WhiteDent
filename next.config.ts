import type { NextConfig } from "next";

const staticExport = process.env.WHITEDENT_STATIC_EXPORT === "1";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  basePath,
  ...(staticExport
    ? { output: "export" as const, trailingSlash: true, images: { unoptimized: true } }
    : { async headers() {
        return [{ source: "/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" }] }];
      } }),
};

export default nextConfig;
