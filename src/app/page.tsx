"use server";
import { Metadata } from "next";
import { PokemonTCG } from "pokemon-tcg-sdk-typescript";
import { Body, CardGrid, Header } from "@components";
import { baseMetadata, loadCards } from "@lib";

export async function generateMetadata(): Promise<Metadata> {
  return baseMetadata;
}

async function getData(): Promise<PokemonTCG.Card[]> {
  try {
    const cardCollectionBase1 = await loadCards(1, 24);
    const pichu = await loadCards(172);
    const cardCollectionBase2 = await loadCards(25, 34);
    const cleffa = await loadCards(173);
    const cardCollectionBase3 = await loadCards(35, 38);
    const igglybuff = await loadCards(174);
    const cardCollectionBase4 = await loadCards(39, 42);
    const crobat = await loadCards(169);
    const cardCollectionBase5 = await loadCards(42, 45);
    const bellossom = await loadCards(182);
    const cardCollectionBase6 = await loadCards(46, 52);
    const perrserker = await loadCards(863);
    const cardCollectionBase7 = await loadCards(53, 57);
    const annihilape = await loadCards(979);
    const cardCollectionBase8 = await loadCards(58, 62);
    const politoed = await loadCards(186);
    const cardCollectionBase9 = await loadCards(63, 80);
    const slowking = await loadCards(199);
    const cardCollectionBase10 = await loadCards(81, 82);
    const magnezone = await loadCards(462);
    const cardCollectionBase11 = await loadCards(83);
    const sirfetchd = await loadCards(865);
    const cardCollectionBase12 = await loadCards(84, 95);
    const steelix = await loadCards(208);
    const cardCollectionBase13 = await loadCards(96, 105);
    const tyrogue = await loadCards(236);
    const cardCollectionBase14 = await loadCards(106, 107);
    const hitmontop = await loadCards(237);
    const cardCollectionBase15 = await loadCards(108);
    const lickilicky = await loadCards(463);
    const cardCollectionBase16 = await loadCards(109, 112);
    const rhyperior = await loadCards(464);
    const happiny = await loadCards(440);
    const cardCollectionBase17 = await loadCards(113);
    const blissey = await loadCards(242);
    const cardCollectionBase18 = await loadCards(114);
    const tangrowth = await loadCards(465);
    const cardCollectionBase19 = await loadCards(115, 117);
    const kingdra = await loadCards(230);
    const cardCollectionBase20 = await loadCards(118, 121);
    const mimeJr = await loadCards(439);
    const cardCollectionBase21 = await loadCards(122);
    const mrRime = await loadCards(866);
    const cardCollectionBase22 = await loadCards(123);
    const scizor = await loadCards(212);
    const kleavor = await loadCards(900);
    const smoochum = await loadCards(238);
    const cardCollectionBase23 = await loadCards(124);
    const elekid = await loadCards(239);
    const cardCollectionBase24 = await loadCards(125);
    const electivire = await loadCards(466);
    const magby = await loadCards(240);
    const cardCollectionBase25 = await loadCards(126);
    const magmortar = await loadCards(467);
    const cardCollectionBase26 = await loadCards(127, 136);
    const espeonUmbreon = await loadCards(196, 197);
    const leafeonGlaceon = await loadCards(470, 471);
    const sylveon = await loadCards(700);
    const cardCollectionBase27 = await loadCards(137);
    const porygon2 = await loadCards(233);
    const porygonZ = await loadCards(474);
    const cardCollectionBase28 = await loadCards(138, 142);
    const munchlax = await loadCards(446);
    const cardCollectionBase29 = await loadCards(143, 151);
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
      ...espeonUmbreon,
      ...leafeonGlaceon,
      ...sylveon,
      ...cardCollectionBase27,
      ...porygon2,
      ...porygonZ,
      ...cardCollectionBase28,
      ...munchlax,
      ...cardCollectionBase29,
    ];
  } catch (error) {
    console.error("Error fetching Pokemon cards at Home:", error);
    return []; // Return empty array as fallback
  }
}

export default async function HomePage() {
  const cards = await getData();

  return (
    <Body>
      <Header
        title={"151 Original Pokémons and it's Variants"}
        subtitle={"A Private Collection"}
        totalCards={cards.length}
        slotsPerPage={9}
      />
      <CardGrid cardCollection={cards} />
    </Body>
  );
}
