import { Metadata } from "next";
import { Guide, WithContext } from "schema-dts";

export const baseMetadata: Metadata = {
  title: "Bone Club - A Private Pokémon TCG Collection",
  description:
    "A comprehensive guide to the Pokémon Trading Card Game collection. Browse through rare cards, special editions, and unique artworks. Features detailed card information, high-quality images, and expert insights. Perfect for collectors and enthusiasts alike.",
  authors: [{ name: "Guilherme Bermêo", url: "https://bermeo.dev" }],
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
    "HTML",
    "CSS",
    "JavaScript",
    "React",
    "Next.js 15",
    "Typescript",
    "Front-end",
    "Brasília",
    "Roraima",
    "Guilherme Bermêo",
    "PokeAPI",
    "Bermêo",
    "Bermeo",
    "Tailwind CSS",
    "Static Site Generation",
  ],
  /* manifest: "/site.webmanifest", */
  robots: "index, follow",
  publisher: "Guilherme Bermeo",
  creator: "Guilherme Bermêo",
  metadataBase: new URL("https://pokemon.bermeo.dev"),
  icons: {
    icon: [
      {
        url: "/favicon.ico",
        sizes: "any",
      },
      { url: "/logo.svg" },
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
    title: "Pokemon TCG",
    description:
      "A comprehensive guide to the Pokémon Trading Card Game collection. Browse through rare cards, special editions, and unique artworks. Features detailed card information, high-quality images, and expert insights. Perfect for collectors and enthusiasts alike.",
    images: [
      {
        url: "https://pokemon.bermeo.dev/opengraph/ghost_marowak.jpg",
        width: 1280,
        height: 720,
        type: "image/jpeg",
      },
      {
        url: "https://pokemon.bermeo.dev/opengraph/marowak.png",
        width: 250,
        height: 250,
        type: "image/png",
      },
    ],
  },
  /* themeColor: "#233140", */
  other: {},
};

export const jsonLd: WithContext<Guide> = {
  "@context": "https://schema.org",
  "@type": "Guide",
  about: "Pokémon TCG",
  name: "Bone Club - A Private Pokémon TCG Collection",
  url: "https://pokemon.bermeo.dev",
  text: "A comprehensive guide to the Pokémon Trading Card Game collection. Browse through rare cards, special editions, and unique artworks. Features detailed card information, high-quality images, and expert insights. Perfect for collectors and enthusiasts alike.",
  reviewAspect: ["Card", "Type", "Collection"],
  image: "https://pokemon.bermeo.dev/logo.svg",
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
