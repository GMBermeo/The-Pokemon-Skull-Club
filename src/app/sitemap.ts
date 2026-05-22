import type { MetadataRoute } from "next";

const SITE_URL = "https://pokemon.bermeo.dev";

const staticRoutes = [
  "",
  "/art",
  "/bones",
  "/charizard",
  "/dogs",
  "/lucario",
  "/mewtwo",
  "/mudkip",
  "/pikachu",
  "/psyduck",
  "/rare-dogs",
  "/subtype",
  "/sudowoodo",
  "/toto",
  "/art/akira",
  "/art/arita",
  "/art/asaka",
  "/art/ikegami",
  "/art/jerky",
  "/art/kantaro",
  "/art/kayama",
  "/art/mekayu",
  "/art/minaminami",
  "/art/mingo",
  "/art/morii",
  "/art/oku",
  "/art/osare",
  "/art/rend",
  "/art/rika",
  "/art/rond",
  "/art/saboteri",
  "/art/toriyufu",
  "/art/uninori",
  "/art/usgmen",
  "/art/yukichi",
  "/art/yukihiro",
  "/art/yuriko",
  "/subtype/baby",
  "/subtype/break",
  "/subtype/ex",
  "/subtype/mega",
  "/subtype/tag-team",
  "/subtype/v-max",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: now,
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.7,
  }));

  const pokedexEntries: MetadataRoute.Sitemap = Array.from(
    { length: 1025 },
    (_, i) => ({
      url: `${SITE_URL}/pokedex/${i + 1}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })
  );

  return [...staticEntries, ...pokedexEntries];
}
