import { Metadata } from "next";
import { Guide, WithContext } from "schema-dts";

export const baseMetadata: Metadata = {
  title: "Bone Club - A Private Pokémon TCG Collection",
  description:
    "This tool was developed using the Static Site Generation (SSG) concept with Next.js in order to index some Pokemon cards for a private collection.",
  authors: [{ name: "Guilherme Bermêo", url: "https://bermeo.dev" }],
  keywords: [
    "Pokemon",
    "TCG",
    "Pokemon TCG",
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
    "Bermeo",
    "Tailwind CSS",
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
      "This tool was developed using the Static Site Generation (SSG) concept with Next.js 15in order to index all the original 151 Pokémons and it's variations cards of the Pokémon TCG for a private collection. 🐶 The source code can be found on github and easily changed to any other parameter.",
    images: [
      {
        url: "https://pokemon.bermeo.dev/bones/ghost_marowak.jpg",
        width: 1280,
        height: 720,
        type: "image/jpeg",
      },
      {
        url: "https://pokemon.bermeo.dev/favicon.png",
        width: 3001,
        height: 3001,
        type: "image/png",
      },
      {
        url: "https://pokemon.bermeo.dev/bones/boneclub1.jpg",
        width: 366,
        height: 366,
        type: "image/jpeg",
      },
      {
        url: "https://pokemon.bermeo.dev/bones/boneclub2.jpg",
        width: 325,
        height: 403,
        type: "image/jpeg",
      },
      {
        url: "https://pokemon.bermeo.dev/bones/marowak.png",
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
  text: "This tool was developed using the Static Site Generation (SSG) concept with Next.js in order to index all the dog type cards of the Magic The Gathering for a private collection. 🐶 The source code can be found on github and easily changed to any other parameter.",
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
