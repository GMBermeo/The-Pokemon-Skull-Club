import type { NextConfig } from "next";

const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  compress: true,
  poweredByHeader: false,
  productionBrowserSourceMaps: false,
  staticPageGenerationTimeout: 2147483,
  images: {
    // images.pokemontcg.io is already a fast CDN; bypass Vercel's Image
    // Optimization (per-image billing) and let the upstream CDN serve them.
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "images.pokemontcg.io" },
    ],
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: ONE_YEAR_SECONDS,
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
      {
        source: "/icons/(.*)",
        headers: [
          { key: "Cache-Control", value: `public, max-age=${ONE_YEAR_SECONDS}, immutable` },
        ],
      },
      {
        source: "/social/(.*)",
        headers: [
          { key: "Cache-Control", value: `public, max-age=${ONE_YEAR_SECONDS}, immutable` },
        ],
      },
      {
        source: "/opengraph/(.*)",
        headers: [
          { key: "Cache-Control", value: `public, max-age=${ONE_YEAR_SECONDS}, immutable` },
        ],
      },
      {
        source: "/(.*)\\.(svg|ico|png|jpg|jpeg|webp|avif)",
        headers: [
          { key: "Cache-Control", value: `public, max-age=${ONE_YEAR_SECONDS}, immutable` },
        ],
      },
    ];
  },
};

export default nextConfig;
