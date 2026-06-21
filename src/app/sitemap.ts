import type { MetadataRoute } from "next";
import {
  artists,
  cardBearingPokedexNumbers,
  getSiteCardIndex,
  pokemonCollections,
  subtypeCollections,
} from "@lib";

const SITE_URL = "https://pokemon.bermeo.dev";

// Keep the sitemap fresh as new cards appear, without rebuilding.
export const revalidate = 604800;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const index = await getSiteCardIndex();

  const entry = (
    path: string,
    priority: number,
    changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"]
  ): MetadataRoute.Sitemap[number] => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency,
    priority,
  });

  // Navigation hubs.
  const hubs = [
    entry("", 1, "weekly"),
    entry("/art", 0.8, "monthly"),
    entry("/subtype", 0.8, "monthly"),
  ];

  // Themed collection pages (config-driven, fully prerendered).
  const collections = pokemonCollections.map((collection) =>
    entry(`/${collection.slug}`, 0.7, "monthly")
  );
  const subtypes = subtypeCollections.map((collection) =>
    entry(`/subtype/${collection.slug}`, 0.7, "monthly")
  );
  const artistPages = artists.map((artist) =>
    entry(`/art/${artist.slug}`, 0.7, "monthly")
  );

  // Pokédex pages — only numbers that actually have cards (no thin pages).
  // /rares is intentionally omitted: it canonicalizes to /pokedex/[n].
  const pokedex = cardBearingPokedexNumbers(index).map((number) =>
    entry(`/pokedex/${number}`, 0.6, "monthly")
  );

  // Card detail pages — the richest, most unique content on the site.
  const cards = index.map((card) =>
    entry(`/card/${card.id}`, 0.5, "monthly")
  );

  return [
    ...hubs,
    ...collections,
    ...subtypes,
    ...artistPages,
    ...pokedex,
    ...cards,
  ];
}
