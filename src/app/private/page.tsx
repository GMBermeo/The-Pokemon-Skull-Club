"use server";
import { Metadata } from "next";
import { PokemonTCG } from "pokemon-tcg-sdk-typescript";
import { Body, CardGrid, Header } from "@components";
import { baseMetadata, retryWithBackoff } from "@lib";
import { sortCardsByDexNumber } from "@utils";

export async function generateMetadata(): Promise<Metadata> {
  return baseMetadata;
}

async function loadCards(
  startNum: number,
  endNum?: number
): Promise<PokemonTCG.Card[]> {
  try {
    const query = endNum
      ? `nationalPokedexNumbers:[${startNum} TO ${endNum}] -set.id:mcd* -rarity:*common* -rarity:*rainbow* -subtypes:V-UNION -subtypes:BREAK`
      : `nationalPokedexNumbers:${startNum} -set.id:mcd* -rarity:*common* -rarity:*rainbow* -subtypes:V-UNION -subtypes:BREAK`;

    const response = await retryWithBackoff(() =>
      PokemonTCG.findCardsByQueries({
        q: query,
      })
    );
    return response;
  } catch (error) {
    console.error(`Error fetching Pokemon cards ${startNum}-${endNum}:`, error);
    return [];
  }
}

async function getData(): Promise<PokemonTCG.Card[]> {
  try {
    const cardCollectionBase1 = sortCardsByDexNumber(await loadCards(1, 24));
    const pichu = sortCardsByDexNumber(await loadCards(172));
    const cardCollectionBase2 = sortCardsByDexNumber(await loadCards(25, 34));
    const cleffa = sortCardsByDexNumber(await loadCards(173));
    const cardCollectionBase3 = sortCardsByDexNumber(await loadCards(35, 38));
    const igglybuff = sortCardsByDexNumber(await loadCards(174));
    const cardCollectionBase4 = sortCardsByDexNumber(await loadCards(39, 42));
    const crobat = sortCardsByDexNumber(await loadCards(169));
    const cardCollectionBase5 = sortCardsByDexNumber(await loadCards(42, 45));
    const bellossom = sortCardsByDexNumber(await loadCards(182));
    const cardCollectionBase6 = sortCardsByDexNumber(await loadCards(46, 52));
    const perrserker = sortCardsByDexNumber(await loadCards(863));
    const cardCollectionBase7 = sortCardsByDexNumber(await loadCards(53, 57));
    const annihilape = sortCardsByDexNumber(await loadCards(979));
    const cardCollectionBase8 = sortCardsByDexNumber(await loadCards(58, 62));
    const politoed = sortCardsByDexNumber(await loadCards(186));
    const cardCollectionBase9 = sortCardsByDexNumber(await loadCards(63, 80));
    const slowking = sortCardsByDexNumber(await loadCards(199));
    const cardCollectionBase10 = sortCardsByDexNumber(await loadCards(81, 82));
    const magnezone = sortCardsByDexNumber(await loadCards(462));
    const cardCollectionBase11 = sortCardsByDexNumber(await loadCards(83));
    const sirfetchd = sortCardsByDexNumber(await loadCards(865));
    const cardCollectionBase12 = sortCardsByDexNumber(await loadCards(84, 95));
    const steelix = sortCardsByDexNumber(await loadCards(208));
    const cardCollectionBase13 = sortCardsByDexNumber(await loadCards(96, 105));
    const tyrogue = sortCardsByDexNumber(await loadCards(236));
    const cardCollectionBase14 = sortCardsByDexNumber(
      await loadCards(106, 107)
    );
    const hitmontop = sortCardsByDexNumber(await loadCards(237));
    const cardCollectionBase15 = sortCardsByDexNumber(await loadCards(108));
    const lickilicky = sortCardsByDexNumber(await loadCards(463));
    const cardCollectionBase16 = sortCardsByDexNumber(
      await loadCards(109, 112)
    );
    const rhyperior = sortCardsByDexNumber(await loadCards(464));
    const happiny = sortCardsByDexNumber(await loadCards(440));
    const cardCollectionBase17 = sortCardsByDexNumber(await loadCards(113));
    const blissey = sortCardsByDexNumber(await loadCards(242));
    const cardCollectionBase18 = sortCardsByDexNumber(await loadCards(114));
    const tangrowth = sortCardsByDexNumber(await loadCards(465));
    const cardCollectionBase19 = sortCardsByDexNumber(
      await loadCards(115, 117)
    );
    const kingdra = sortCardsByDexNumber(await loadCards(230));
    const cardCollectionBase20 = sortCardsByDexNumber(
      await loadCards(118, 121)
    );
    const mimeJr = sortCardsByDexNumber(await loadCards(439));
    const cardCollectionBase21 = sortCardsByDexNumber(await loadCards(122));
    const mrRime = sortCardsByDexNumber(await loadCards(866));
    const cardCollectionBase22 = sortCardsByDexNumber(await loadCards(123));
    const scizor = sortCardsByDexNumber(await loadCards(212));
    const kleavor = sortCardsByDexNumber(await loadCards(900));
    const smoochum = sortCardsByDexNumber(await loadCards(238));
    const cardCollectionBase23 = sortCardsByDexNumber(await loadCards(124));
    const elekid = sortCardsByDexNumber(await loadCards(239));
    const cardCollectionBase24 = sortCardsByDexNumber(await loadCards(125));
    const electivire = sortCardsByDexNumber(await loadCards(466));
    const magby = sortCardsByDexNumber(await loadCards(240));
    const cardCollectionBase25 = sortCardsByDexNumber(await loadCards(126));
    const magmortar = sortCardsByDexNumber(await loadCards(467));
    const cardCollectionBase26 = sortCardsByDexNumber(
      await loadCards(127, 136)
    );
    const espeon = sortCardsByDexNumber(await loadCards(196));
    const umbreon = sortCardsByDexNumber(await loadCards(197));
    const leafeon = sortCardsByDexNumber(await loadCards(470));
    const glaceon = sortCardsByDexNumber(await loadCards(471));
    const sylveon = sortCardsByDexNumber(await loadCards(700));
    const cardCollectionBase27 = sortCardsByDexNumber(await loadCards(137));
    const porygon2 = sortCardsByDexNumber(await loadCards(233));
    const porygonZ = sortCardsByDexNumber(await loadCards(474));
    const cardCollectionBase28 = sortCardsByDexNumber(
      await loadCards(138, 142)
    );
    const munchlax = sortCardsByDexNumber(await loadCards(446));
    const cardCollectionBase29 = sortCardsByDexNumber(
      await loadCards(143, 151)
    );

    // Combine all collections in the specified order
    return [
      ...cardCollectionBase1,
      ...pichu,
      ...cardCollectionBase2,
      ...cleffa,
      ...cardCollectionBase3,
      ...igglybuff,
      ...cardCollectionBase4,
      ...crobat,
      ...cardCollectionBase5,
      ...bellossom,
      ...cardCollectionBase6,
      ...perrserker,
      ...cardCollectionBase7,
      ...annihilape,
      ...cardCollectionBase8,
      ...politoed,
      ...cardCollectionBase9,
      ...slowking,
      ...cardCollectionBase10,
      ...magnezone,
      ...cardCollectionBase11,
      ...sirfetchd,
      ...cardCollectionBase12,
      ...steelix,
      ...cardCollectionBase13,
      ...tyrogue,
      ...cardCollectionBase14,
      ...hitmontop,
      ...cardCollectionBase15,
      ...lickilicky,
      ...cardCollectionBase16,
      ...rhyperior,
      ...happiny,
      ...cardCollectionBase17,
      ...blissey,
      ...cardCollectionBase18,
      ...tangrowth,
      ...cardCollectionBase19,
      ...kingdra,
      ...cardCollectionBase20,
      ...mimeJr,
      ...cardCollectionBase21,
      ...mrRime,
      ...cardCollectionBase22,
      ...scizor,
      ...kleavor,
      ...smoochum,
      ...cardCollectionBase23,
      ...elekid,
      ...cardCollectionBase24,
      ...electivire,
      ...magby,
      ...cardCollectionBase25,
      ...magmortar,
      ...cardCollectionBase26,
      ...espeon,
      ...umbreon,
      ...leafeon,
      ...glaceon,
      ...sylveon,
      ...cardCollectionBase27,
      ...porygon2,
      ...porygonZ,
      ...cardCollectionBase28,
      ...munchlax,
      ...cardCollectionBase29,
    ];
  } catch (error) {
    console.error("Error fetching Pokemon cards at Private Collection:", error);
    return []; // Return empty array as fallback
  }
}

export default async function PrivateCollectionPage() {
  const cards = await getData();

  return (
    <Body>
      <Header
        title={"Rare Pokémon Collection"}
        subtitle={"Original 151 Pokémon and their Evolutions"}
        totalCards={cards.length}
        slotsPerPage={9}
      />
      <CardGrid cardCollection={cards} />
    </Body>
  );
}
