import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Bone Club - A Private Pokémon TCG Collection",
    short_name: "Bone Club",
    description:
      "A comprehensive guide to the Pokémon Trading Card Game collection. Browse rare cards, special editions, and unique artworks.",
    start_url: "/",
    display: "standalone",
    background_color: "#233140",
    theme_color: "#233140",
    orientation: "portrait",
    icons: [
      {
        src: "/icons/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/icons/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
