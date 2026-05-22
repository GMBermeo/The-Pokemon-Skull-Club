import type { JSX } from "react";
import type { Metadata } from "next";
import { PokemonTCG } from "@pokelib/pokemon-tcg-sdk-typescript";
import { Body, CardGrid, Header } from "@components";
import { buildMetadata, retryWithBackoff } from "@lib";
import { sortCardsByDexNumber } from "@utils";

export const metadata: Metadata = buildMetadata({
  path: "/private",
  title: "Private Collection",
  description: "A private Pokémon TCG collection — not publicly indexed.",
  noindex: true,
});

type Range = readonly [start: number, end?: number];

const RANGES: readonly Range[] = [
  [1, 24],
  [172],
  [25, 34],
  [173],
  [35, 38],
  [174],
  [39, 42],
  [169],
  [42, 45],
  [182],
  [46, 52],
  [863],
  [53, 57],
  [979],
  [58, 62],
  [186],
  [63, 80],
  [199],
  [81, 82],
  [462],
  [83],
  [865],
  [84, 95],
  [208],
  [96, 105],
  [236],
  [106, 107],
  [237],
  [108],
  [463],
  [109, 112],
  [464],
  [440],
  [113],
  [242],
  [114],
  [465],
  [115, 117],
  [230],
  [118, 121],
  [439],
  [122],
  [866],
  [123],
  [212],
  [900],
  [238],
  [124],
  [239],
  [125],
  [466],
  [240],
  [126],
  [467],
  [127, 136],
  [196],
  [197],
  [470],
  [471],
  [700],
  [137],
  [233],
  [474],
  [138, 142],
  [446],
  [143, 151],
];

async function loadRange(start: number, end?: number): Promise<PokemonTCG.ICard[]> {
  try {
    const query = end
      ? `nationalPokedexNumbers:[${start} TO ${end}] -set.id:mcd* -rarity:*common* -rarity:*rainbow* -subtypes:V-UNION -subtypes:BREAK`
      : `nationalPokedexNumbers:${start} -set.id:mcd* -rarity:*common* -rarity:*rainbow* -subtypes:V-UNION -subtypes:BREAK`;
    const response = await retryWithBackoff(() =>
      PokemonTCG.findCardsByQueries({ q: query })
    );
    return sortCardsByDexNumber(response);
  } catch (error) {
    console.error(`Error fetching private cards ${start}-${end ?? ""}:`, error);
    return [];
  }
}

async function getData(): Promise<PokemonTCG.ICard[]> {
  const results = await Promise.all(RANGES.map(([s, e]) => loadRange(s, e)));
  return results.flat();
}

export default async function PrivateCollectionPage(): Promise<JSX.Element> {
  const cards = await getData();

  return (
    <Body>
      <Header
        title="Rare Pokémon Collection"
        subtitle="Original 151 Pokémon and their Evolutions"
        totalCards={cards.length}
        slotsPerPage={9}
      />
      <CardGrid cardCollection={cards} />
    </Body>
  );
}
