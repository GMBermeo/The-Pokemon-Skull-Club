import type { Metadata } from "next";
import type { PokemonTCG } from "@pokelib/pokemon-tcg-sdk-typescript";
import { buildMetadata, type OgImage } from "./base-metadata";
import { getCardsByQuery } from "./card-source";
import { sortCardsByDateAndPokedex } from "../utils/sort-collection";

const DEFAULT_ORDER = "-set.releaseDate";

export type CardSource = { q: string; orderBy?: string };

type SortStrategy = "date" | "none";

/**
 * A Collection is a themed grid of cards fetched from one or more queries.
 * Every single-Pokémon page and every subtype page is now just one of these
 * config objects; the route reads the config and renders it. One module, a
 * data table, instead of ~17 near-identical page files.
 */
export type CollectionConfig = {
  slug: string;
  /** Canonical prefix: "" for root routes, "/subtype" for subtype routes. */
  basePath?: string;
  title: string;
  headerTitle: string;
  subtitle: string;
  description: string;
  keywords: string[];
  sources: CardSource[];
  sort?: SortStrategy;
  theme?: string;
  slotsPerPage?: number;
  ogImages?: OgImage[];
};

/** Fetch every source in parallel, dedupe by id, optionally sort. */
export async function loadCollection(
  config: CollectionConfig
): Promise<PokemonTCG.ICard[]> {
  const groups = await Promise.all(
    config.sources.map((source) =>
      getCardsByQuery(source.q, source.orderBy ?? DEFAULT_ORDER)
    )
  );

  const seen = new Set<string>();
  const merged: PokemonTCG.ICard[] = [];
  for (const card of groups.flat()) {
    if (seen.has(card.id)) continue;
    seen.add(card.id);
    merged.push(card);
  }

  return config.sort === "date" ? sortCardsByDateAndPokedex(merged) : merged;
}

export function collectionMetadata(config: CollectionConfig): Metadata {
  return buildMetadata({
    path: `${config.basePath ?? ""}/${config.slug}`,
    title: config.title,
    description: config.description,
    keywords: config.keywords,
    ogImages: config.ogImages,
  });
}

const BASE_FILTER = "-set.id:mcd* -subtypes:V-UNION";

/** Pokémon featured on /dogs and /rare-dogs (Growlithe → Okidogi). */
const DOG_NUMBERS = [
  58, 59, 209, 210, 228, 229, 235, 261, 262, 309, 310, 447, 448, 506, 507, 508,
  676, 744, 745, 835, 836, 888, 889, 926, 927, 942, 943, 971, 972, 1014,
];

const dexQuery = (n: number): CardSource => ({
  q: `nationalPokedexNumbers:${n} ${BASE_FILTER}`,
});

const rareDexQuery = (n: number): CardSource => ({
  q: `nationalPokedexNumbers:${n} -set.id:mcd* -rarity:*rainbow* -rarity:*common* -subtypes:V-UNION`,
});

// ---------------------------------------------------------------------------
// Single-Pokémon collections — served by app/[collection]/page.tsx
// ---------------------------------------------------------------------------

export const pokemonCollections: CollectionConfig[] = [
  {
    slug: "charizard",
    title: "Charizards",
    headerTitle: "Charizard",
    subtitle: "Flame non-dragon",
    description:
      "Explore our comprehensive Charizard Pokémon card collection guide. From vintage Base Set to modern releases, discover rare variants, secret rares, and iconic artworks of this legendary Fire-type Pokémon. Complete with market insights and collection tips.",
    keywords: ["pokemon", "tcg", "charizard", "fire", "dragon", "pokemon tcg", "flame"],
    sources: [{ q: `nationalPokedexNumbers:6 ${BASE_FILTER}` }],
    sort: "none",
    theme: "bg-red-50 dark:bg-red-950 text-red-950",
    slotsPerPage: 9,
    ogImages: [
      { url: "https://pokemon.bermeo.dev/opengraph/charizard1.jpg", width: 800, height: 450, type: "image/jpeg" },
      { url: "https://pokemon.bermeo.dev/opengraph/charizard2.jpg", width: 1206, height: 679, type: "image/jpeg" },
    ],
  },
  {
    slug: "lucario",
    title: "Riolus & Lucarios",
    headerTitle: "Aura Sphere",
    subtitle: "Riolus & Lucarios",
    description:
      "'By catching the aura emanating from others, it can read their thoughts and movements.' ⚡ This tool was developed using the SSG with Next.js 15 in order to index all the Riolu and Lucario cards from Pokémon TCG for a private collection. ⚡ The source code can be found on github and easily changed to any other parameter.",
    keywords: ["pokemon", "tcg", "riolu", "lucario", "aura", "pokemon tcg", "aurasphere"],
    sources: [{ q: `nationalPokedexNumbers:[447 TO 448] ${BASE_FILTER}` }],
    sort: "date",
    theme: "bg-cyan-50 dark:bg-cyan-900 text-cyan-950",
    slotsPerPage: 4,
    ogImages: [
      { url: "https://pokemon.bermeo.dev/opengraph/lucario.jpg", width: 1400, height: 700, alt: "Lucario & Riolu", type: "image/jpeg" },
    ],
  },
  {
    slug: "mewtwo",
    title: "Mewtwo",
    headerTitle: "Mewtwo",
    subtitle: "Genetic Pokémon",
    description:
      "'A Pokémon created by recombining Mew's genes. It's said to have the most savage heart among Pokémon.' 🧬 This tool was developed using the SSG with Next.js 15 in order to index all the Mewtwo cards from Pokémon TCG for a private collection. 🧬 The source code can be found on github and easily changed to any other parameter.",
    keywords: ["pokemon", "tcg", "mewtwo", "psychic", "legendary", "pokemon tcg", "genetic"],
    sources: [{ q: `nationalPokedexNumbers:150 ${BASE_FILTER}` }],
    sort: "none",
    theme: "bg-purple-50 dark:bg-purple-950 text-purple-950",
    slotsPerPage: 9,
    ogImages: [
      { url: "https://pokemon.bermeo.dev/opengraph/mewtwo.jpg", width: 1400, height: 700, alt: "Mewtwo", type: "image/jpeg" },
    ],
  },
  {
    slug: "pikachu",
    title: "Pikachus",
    headerTitle: "Pikachu",
    subtitle: "The face",
    description:
      "'When several of these Pokémon gather, their electricity can build and cause lightning storms. It keeps its tail raised to monitor its surroundings.' ⚡ This tool was developed using the SSG with Next.js 15 in order to index all the Pikachu cards from Pokémon TCG for a private collection. ⚡ The source code can be found on github and easily changed to any other parameter.",
    keywords: ["pokemon", "tcg", "pikachu", "electric", "mouse", "pokemon tcg", "thunderbolt"],
    sources: [{ q: `nationalPokedexNumbers:25 ${BASE_FILTER}` }],
    sort: "none",
    theme: "bg-yellow-50 dark:bg-yellow-950 text-yellow-950",
    slotsPerPage: 9,
    ogImages: [
      { url: "https://pokemon.bermeo.dev/opengraph/pikachu.jpg", width: 1210, height: 544, type: "image/jpeg" },
    ],
  },
  {
    slug: "psyduck",
    title: "Psyducks",
    headerTitle: "Psyduck",
    subtitle: "Duck with a headache",
    description:
      "'While lulling its enemies with its vacant look, this wily Pokémon will use psychokinetic powers.' 🦆 This tool was developed using the SSG with Next.js 15 in order to index all the Psyduck cards from Pokémon TCG for a private collection. 🦆 The source code can be found on github and easily changed to any other parameter.",
    keywords: ["pokemon", "tcg", "psyduck", "water", "psychic", "pokemon tcg", "headache"],
    sources: [{ q: `nationalPokedexNumbers:54 ${BASE_FILTER}` }],
    sort: "none",
    theme: "bg-blue-50 dark:bg-blue-950 text-blue-950",
    ogImages: [
      { url: "https://pokemon.bermeo.dev/opengraph/psyduck.jpg", width: 1178, height: 679, alt: "Psyduck meme", type: "image/jpeg" },
    ],
  },
  {
    slug: "sudowoodo",
    title: "Bonsly & Sudowoodo",
    headerTitle: "Os cara de pau",
    subtitle: "Sudowoodo & Bonsly",
    description:
      "'Although it always pretends to be a tree, its body is actually more like rock than like plant material.' 🌳 This tool was developed using the SSG with Next.js 15 in order to index all the Sudowoodo and Bonsly cards from Pokémon TCG for a private collection. 🌳 The source code can be found on github and easily changed to any other parameter.",
    keywords: ["pokemon", "tcg", "sudowoodo", "bonsly", "rock", "tree", "pokemon tcg", "imitation"],
    sources: [{ q: `nationalPokedexNumbers:185 ${BASE_FILTER}` }, { q: `nationalPokedexNumbers:438 ${BASE_FILTER}` }],
    sort: "date",
    theme: "bg-amber-50 dark:bg-amber-950 text-amber-950",
    ogImages: [
      { url: "https://pokemon.bermeo.dev/opengraph/sudowoodo.jpg", width: 800, height: 450, alt: "Sudowoodos", type: "image/jpeg" },
    ],
  },
  {
    slug: "toto",
    title: "Totodile Evolution Line",
    headerTitle: "Totó",
    subtitle: "Totodile, Croconaw & Feraligatr",
    description:
      "'Despite its small body, Totodile's jaws are very powerful. While it may think it is just playfully nipping, its bite has enough strength to cause serious injury.' 💧 This tool was developed using the SSG with Next.js 15 in order to index all the Totodile, Croconaw and Feraligatr cards from Pokémon TCG for a private collection. 💧 The source code can be found on github and easily changed to any other parameter.",
    keywords: ["pokemon", "tcg", "totodile", "croconaw", "feraligatr", "water", "pokemon tcg", "johto"],
    sources: [{ q: `nationalPokedexNumbers:[158 TO 160] ${BASE_FILTER}` }],
    sort: "date",
    theme: "bg-blue-50 dark:bg-blue-950 text-blue-950",
    ogImages: [
      { url: "https://pokemon.bermeo.dev/opengraph/totodile.jpg", width: 452, height: 339, alt: "Totodile biting", type: "image/jpeg" },
    ],
  },
  {
    slug: "bones",
    title: "Bone Club - Cubones & Marowaks",
    headerTitle: "Bone Club",
    subtitle: "Cubones & Marowaks",
    description:
      "Discover our exclusive Cubone & Marowak Pokémon card collection guide. Explore rare variants, unique artworks, and special editions of these iconic Ground-type Pokémon. Features detailed card information and high-quality images of every Bone Club member.",
    keywords: ["pokemon", "tcg", "cubone", "marowak", "bones", "pokemon tcg", "boneclub"],
    sources: [{ q: `nationalPokedexNumbers:[104 TO 105] ${BASE_FILTER}` }],
    sort: "date",
    ogImages: [
      { url: "https://pokemon.bermeo.dev/opengraph/ghost_marowak.jpg", width: 1280, height: 720, type: "image/jpeg" },
    ],
  },
  {
    slug: "mudkip",
    title: "Mudkip",
    headerTitle: "Mudkip",
    subtitle: "The Mud Fish",
    description:
      "'In water, Mudkip breathes using the gills on its cheeks. If it is faced with a tight situation in battle, this Pokémon will unleash its amazing power—it can crush rocks bigger than itself.' 💧 This tool was developed using the SSG with Next.js 15 in order to index all the Mudkip cards from Pokémon TCG for a private collection. 💧 The source code can be found on github and easily changed to any other parameter.",
    keywords: ["pokemon", "tcg", "mudkip", "water", "starter", "pokemon tcg", "hoenn"],
    sources: [{ q: `nationalPokedexNumbers:258 ${BASE_FILTER}` }],
    sort: "none",
    theme: "bg-blue-50 dark:bg-blue-950 text-blue-950",
    slotsPerPage: 9,
    ogImages: [
      { url: "https://pokemon.bermeo.dev/opengraph/mudkip.jpg", width: 480, height: 360, type: "image/jpeg" },
    ],
  },
  {
    slug: "dogs",
    title: "Pokémon Dogs Collection",
    headerTitle: "Pokémon Dogs",
    subtitle: "All Dog-like Pokémon Cards",
    description:
      "A comprehensive collection of all dog-like Pokémon cards from the Pokémon Trading Card Game. From Growlithe to Mabosstiff, discover all the canine companions throughout the generations.",
    keywords: ["pokemon", "tcg", "dogs", "growlithe", "arcanine", "houndour", "houndoom", "pokemon dogs", "zacian", "zamazenta"],
    sources: DOG_NUMBERS.map(dexQuery),
    sort: "date",
    theme: "bg-amber-50 dark:bg-amber-950 text-amber-950",
    slotsPerPage: 9,
  },
  {
    slug: "rare-dogs",
    title: "Pokémon Dogs Collection",
    headerTitle: "Rare Pokémon Dogs",
    subtitle: "Rare Dog-like Pokémon Cards",
    description:
      "A comprehensive collection of all dog-like Pokémon cards from the Pokémon Trading Card Game. From Growlithe to Mabosstiff, discover all the canine companions throughout the generations.",
    keywords: ["pokemon", "tcg", "dogs", "growlithe", "arcanine", "houndour", "houndoom", "pokemon dogs", "zacian", "zamazenta"],
    sources: DOG_NUMBERS.map(rareDexQuery),
    sort: "date",
    theme: "bg-amber-50 dark:bg-slate-900 text-slate-950",
    slotsPerPage: 9,
  },
];

// ---------------------------------------------------------------------------
// Subtype collections — served by app/subtype/[subtype]/page.tsx
// ---------------------------------------------------------------------------

export const subtypeCollections: CollectionConfig[] = [
  {
    slug: "baby",
    basePath: "/subtype",
    title: "Baby Pokémon Cards Collection",
    headerTitle: "Baby Pokémon Cards",
    subtitle: "Small but Special",
    description:
      "Explore an extensive Baby Pokémon card collection guide. Browse through these adorable pre-evolved forms featuring charming artwork and unique abilities. Features comprehensive information about every Baby Pokémon card release, rarity details, and collection insights.",
    keywords: ["pokemon", "tcg", "baby", "baby pokemon", "pre-evolution", "pokemon tcg", "special cards", "rare cards"],
    sources: [{ q: `subtypes:baby ${BASE_FILTER}` }],
    sort: "date",
    theme: "bg-pink-50 dark:bg-pink-900 text-pink-950",
  },
  {
    slug: "break",
    basePath: "/subtype",
    title: "BREAK Cards Collection",
    headerTitle: "BREAK Cards",
    subtitle: "Evolution Unleashed",
    description:
      "Explore an extensive Pokémon BREAK card collection guide. Browse through these unique evolution cards that break through their previous limitations. Features comprehensive information about every BREAK card release, rarity details, and collection insights.",
    keywords: ["pokemon", "tcg", "break", "break evolution", "pokemon break", "pokemon tcg", "special cards", "rare cards"],
    sources: [{ q: `subtypes:BREAK ${BASE_FILTER}` }],
    sort: "date",
    theme: "bg-yellow-50 dark:bg-yellow-950 text-yellow-950",
  },
  {
    slug: "ex",
    basePath: "/subtype",
    title: "EX Cards Collection",
    headerTitle: "EX Cards",
    subtitle: "Special & Powerful",
    description:
      "Explore a extensive Pokémon-EX card collection guide. Browse through powerful EX variants, ultra-rare cards, and stunning full-art designs. Features comprehensive information about every EX card release, rarity details, and collection insights.",
    keywords: ["pokemon", "tcg", "ex", "pokemon ex", "full art", "pokemon tcg", "special cards", "rare cards"],
    sources: [{ q: `subtypes:EX ${BASE_FILTER}` }],
    sort: "none",
    theme: "bg-purple-50 dark:bg-purple-950 text-purple-950",
  },
  {
    slug: "mega",
    basePath: "/subtype",
    title: "Mega Evolution Cards Collection",
    headerTitle: "Mega Evolution Cards",
    subtitle: "Beyond Evolution",
    description:
      "Explore an extensive Pokémon Mega Evolution card collection guide. Browse through these powerful evolved forms featuring stunning artwork and incredible abilities. Features comprehensive information about every Mega Evolution card release, rarity details, and collection insights.",
    keywords: ["pokemon", "tcg", "mega", "mega evolution", "pokemon mega", "pokemon tcg", "special cards", "rare cards", "evolution cards"],
    sources: [{ q: `subtypes:MEGA ${BASE_FILTER}` }],
    sort: "date",
    theme: "bg-blue-50 dark:bg-blue-950 text-blue-950",
  },
  {
    slug: "tag-team",
    basePath: "/subtype",
    title: "TAG TEAM Cards Collection",
    headerTitle: "TAG TEAM Cards",
    subtitle: "Two Pokémon, One Card",
    description:
      "Explore an extensive Pokémon TAG TEAM card collection guide. Browse through these powerful team-up cards featuring stunning artwork and incredible abilities. Features comprehensive information about every TAG TEAM card release, rarity details, and collection insights.",
    keywords: ["pokemon", "tcg", "tag team", "pokemon tag team", "team up", "pokemon tcg", "special cards", "rare cards"],
    sources: [{ q: `subtypes:"TAG TEAM" ${BASE_FILTER}` }],
    sort: "date",
    theme: "bg-blue-50 dark:bg-slate-900 text-slate-950",
  },
  {
    slug: "v-max",
    basePath: "/subtype",
    title: "VMAX Cards Collection",
    headerTitle: "VMAX Cards",
    subtitle: "Gigantic Power",
    description:
      "Explore an extensive Pokémon VMAX card collection guide. Browse through these gigantic and powerful Pokémon cards featuring stunning artwork and incredible abilities. Features comprehensive information about every VMAX card release, rarity details, and collection insights.",
    keywords: ["pokemon", "tcg", "vmax", "v-max", "pokemon vmax", "pokemon tcg", "special cards", "rare cards"],
    sources: [{ q: `subtypes:VMAX ${BASE_FILTER}` }],
    sort: "date",
    theme: "bg-red-50 dark:bg-red-950 text-red-950",
  },
];
