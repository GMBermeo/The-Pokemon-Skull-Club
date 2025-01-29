import { PokemonTCG } from "pokemon-tcg-sdk-typescript";
import { loadCards } from "@lib";

export async function fetchPokemonCollection(): Promise<PokemonTCG.Card[]> {
  const cardCollections = await Promise.allSettled([
    loadCards(1, 24),
    loadCards(172),
    loadCards(25, 34),
    loadCards(173),
    loadCards(35, 38),
    loadCards(174),
    loadCards(39, 42),
    loadCards(169),
    loadCards(42, 45),
    loadCards(182),
    loadCards(46, 52),
    loadCards(863),
    loadCards(53, 57),
    loadCards(979),
    loadCards(58, 62),
    loadCards(186),
    loadCards(63, 80),
    loadCards(199),
    loadCards(81, 82),
    loadCards(462),
    loadCards(83),
    loadCards(865),
    loadCards(84, 95),
    loadCards(208),
    loadCards(96, 105),
    loadCards(236),
    loadCards(106, 107),
    loadCards(237),
    loadCards(108),
    loadCards(463),
    loadCards(109, 112),
    loadCards(464),
    loadCards(440),
    loadCards(113),
    loadCards(242),
    loadCards(114),
    loadCards(465),
    loadCards(115, 117),
    loadCards(230),
    loadCards(118, 121),
    loadCards(439),
    loadCards(122),
    loadCards(866),
    loadCards(123),
    loadCards(212),
    loadCards(900),
    loadCards(238),
    loadCards(124),
    loadCards(239),
    loadCards(125),
    loadCards(466),
    loadCards(240),
    loadCards(126),
    loadCards(467),
    loadCards(127, 136),
    loadCards(196, 197),
    loadCards(470, 471),
    loadCards(700),
    loadCards(137),
    loadCards(233),
    loadCards(474),
    loadCards(138, 142),
    loadCards(446),
    loadCards(143, 151),
  ]);

  // Filter for successful promises and flatten their values
  return cardCollections
    .filter(
      (result): result is PromiseFulfilledResult<PokemonTCG.Card[]> =>
        result.status === "fulfilled"
    )
    .map((result) => result.value)
    .flat()
    .filter(
      (card: PokemonTCG.Card, index: number, self: PokemonTCG.Card[]) =>
        index === self.findIndex((t) => t.id === card.id)
    );
}
