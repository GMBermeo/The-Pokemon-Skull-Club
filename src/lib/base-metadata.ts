import type { Metadata, Viewport } from "next";
import type { Guide, WithContext } from "schema-dts";

export const SITE_URL = "https://pokemon.bermeo.dev";

const SITE_TITLE = "Bone Club - A Private Pokémon TCG Collection";
const SITE_DESCRIPTION =
  "A comprehensive guide to the Pokémon Trading Card Game collection. Browse through rare cards, special editions, and unique artworks. Features detailed card information, high-quality images, and expert insights. Perfect for collectors and enthusiasts alike.";

export const baseViewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8fafc" },
    { media: "(prefers-color-scheme: dark)", color: "#1e293b" },
  ],
  colorScheme: "dark light",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const baseMetadata: Metadata = {
  title: {
    default: SITE_TITLE,
    template: "%s | Bone Club",
  },
  description: SITE_DESCRIPTION,
  applicationName: "Bone Club",
  authors: [{ name: "Guilherme Bermêo", url: "https://bermeo.dev" }],
  generator: "Next.js",
  keywords: [
    "Pokemon",
    "TCG",
    "Pokemon TCG",
    "Trading Card Game",
    "Bone Club",
    "Cubone",
    "Marowak",
    "Pokémon",
    "Pokémon TCG",
    "Charizard",
    "Pikachu",
    "Lucario",
    "Mewtwo",
    "Psyduck",
    "Sudowoodo",
    "Totodile",
    "Original 151",
    "Next.js",
    "Typescript",
    "Tailwind CSS",
    "Static Site Generation",
    "Guilherme Bermêo",
    "Bermeo",
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  publisher: "Guilherme Bermeo",
  creator: "Guilherme Bermêo",
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: "/",
  },
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/logo.svg", type: "image/svg+xml" },
      {
        url: "/icons/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        url: "/icons/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
      { url: "/icons/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180" }],
  },
  openGraph: {
    type: "website",
    siteName: "Bone Club",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    locale: "en_US",
    images: [
      {
        url: "/opengraph/ghost_marowak.jpg",
        width: 1280,
        height: 720,
        alt: "Ghost Marowak — Bone Club banner",
        type: "image/jpeg",
      },
      {
        url: "/opengraph/marowak.png",
        width: 250,
        height: 250,
        alt: "Marowak icon",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [`${SITE_URL}/opengraph/ghost_marowak.jpg`],
    creator: "@gmbermeo",
  },
  category: "games",
};

type BuildMetadataInput = {
  path: string;
  title?: string;
  description?: string;
  keywords?: string[];
  ogImage?: string;
  noindex?: boolean;
};

export function buildMetadata({
  path,
  title,
  description,
  keywords,
  ogImage,
  noindex,
}: BuildMetadataInput): Metadata {
  const canonicalPath = path.startsWith("/") ? path : `/${path}`;
  const fullUrl = `${SITE_URL}${canonicalPath === "/" ? "" : canonicalPath}`;
  const finalDescription = description ?? SITE_DESCRIPTION;
  const finalTitle = title ?? SITE_TITLE;

  return {
    ...baseMetadata,
    title,
    description: finalDescription,
    keywords: keywords ?? baseMetadata.keywords,
    alternates: { canonical: canonicalPath },
    robots: noindex
      ? { index: false, follow: false }
      : baseMetadata.robots,
    openGraph: {
      ...baseMetadata.openGraph,
      title: finalTitle,
      description: finalDescription,
      url: fullUrl,
      ...(ogImage
        ? {
            images: [
              {
                url: ogImage.startsWith("http") ? ogImage : `${SITE_URL}${ogImage}`,
                width: 1200,
                height: 630,
                alt: finalTitle,
              },
            ],
          }
        : {}),
    },
    twitter: {
      ...baseMetadata.twitter,
      title: finalTitle,
      description: finalDescription,
      ...(ogImage
        ? {
            images: [
              ogImage.startsWith("http") ? ogImage : `${SITE_URL}${ogImage}`,
            ],
          }
        : {}),
    },
  };
}

export const jsonLd: WithContext<Guide> = {
  "@context": "https://schema.org",
  "@type": "Guide",
  about: "Pokémon TCG",
  name: SITE_TITLE,
  url: SITE_URL,
  text: SITE_DESCRIPTION,
  reviewAspect: ["Card", "Type", "Collection"],
  image: `${SITE_URL}/logo.svg`,
  creator: {
    "@type": "Person",
    name: "Guilherme Bermeo",
    url: "https://www.bermeo.dev",
    sameAs: [
      "https://github.com/GMBermeo",
      "https://www.linkedin.com/in/gmbermeo/",
      "https://www.instagram.com/guilherme.bermeo/",
    ],
    email: "mailto:guilherme@bermeo.dev",
  },
  author: {
    "@type": "Person",
    name: "Guilherme Bermeo",
    url: "https://www.bermeo.dev",
    sameAs: [
      "https://github.com/GMBermeo",
      "https://www.linkedin.com/in/gmbermeo/",
      "https://www.instagram.com/guilherme.bermeo/",
    ],
    email: "mailto:guilherme@bermeo.dev",
    image: "https://bermeo.dev/logo.svg",
    jobTitle: "Front-end Developer",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Brasília",
      addressRegion: "DF",
    },
  },
};
