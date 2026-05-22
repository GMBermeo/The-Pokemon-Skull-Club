import { PokemonTCG } from "@pokelib/pokemon-tcg-sdk-typescript";
import { loadCards } from "@lib";

type LoadArgs = readonly [start: number, end?: number];

const POKEDEX_RANGES: readonly LoadArgs[] = [
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
  [196, 197],
  [470, 471],
  [700],
  [137],
  [233],
  [474],
  [138, 142],
  [446],
  [143, 151],
];

export async function fetchPokemonCollection(): Promise<PokemonTCG.ICard[]> {
  const results = await Promise.all(
    POKEDEX_RANGES.map(([start, end]) => loadCards(start, end))
  );

  const flat = results.flat();
  const seen = new Set<string>();
  const deduped: PokemonTCG.ICard[] = [];
  for (const card of flat) {
    if (seen.has(card.id)) continue;
    seen.add(card.id);
    deduped.push(card);
  }
  return deduped;
}
