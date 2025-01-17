"use server";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Cubones",
    description:
      "This tool was developed using the Static Site Generation (SSG) concept with Next.js in order to index all the dog type cards of the Magic The Gathering for a private collection.",
    authors: [{ name: "Guilherme Bermêo" }],
    keywords: [
      "HTML",
      "CSS",
      "JavaScript",
      "React",
      "Next.js",
      "Typescript",
      "Front-end",
      "Brasília",
      "Roraima",
      "Guilherme Bermêo",
      "Bermeo",
      "Vue.js",
      "Tailwind CSS",
      "Bootstrap",
    ],
    manifest: "/site.webmanifest",
    icons: {
      icon: [
        { url: "/Logo.svg" },
        { url: "/icons/favicon-32x32.png", sizes: "32x32", type: "image/png" },
        { url: "/icons/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      ],
      apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180" }],
      other: [
        {
          rel: "mask-icon",
          url: "/icons/safari-pinned-tab.svg",
          color: "#c0392b",
        },
      ],
    },
    themeColor: "#233140",
    other: {
      "msapplication-TileColor": "#233140",
      canonical: "https://lands-of-mtg.bermeo.dev",
      language: "English",
    },
  };
}

// Schema.org JSON-LD
const schemaData = {
  "@context": "https://schema.org",
  "@type": "Guide",
  about: "Magic of the Gathering",
  name: "The Dogs of Magic The Gathering",
  url: "https://lands-of-mtg.bermeo.dev",
  text: "This tool was developed using the Static Site Generation (SSG) concept with Next.js in order to index all the dog type cards of the Magic The Gathering for a private collection. 🐶 The source code can be found on github and easily changed to any other parameter.",
  reviewAspect: ["Card", "Type", "Collection"],
  author: {
    "@type": "Person",
    name: "Guilherme Bermeo",
    url: "https://www.bermeo.dev",
    sameAs: [
      "https://github.com/GMBermeo",
      "https://www.linkedin.com/in/gmbermeo/",
      // ... rest of the sameAs array
    ],
    email: "mailto:guilherme@bermeo.dev",
    image: "https://lands-of-mtg.bermeo.dev/Logo.svg",
    jobTitle: "Front-end Developer",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Brasília",
      addressRegion: "DF",
    },
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
        />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
