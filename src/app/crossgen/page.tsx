import { PokemonTCG } from "pokemon-tcg-sdk-typescript";
import { loadCards } from "@lib";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pokémon TCG",
  description:
    "'If you're starving, eat your horses, your dead, or yourself—but NEVER eat your dog.' —General Jarkeld, the Arctic Fox. 🐾 This tool was developed using the Static Site Generation (SSG) concept with Next.js in order to index all the dog type cards of the Magic The Gathering for a private collection. 🐶 The source code can be found on github and easily changed to any other parameter.",
  openGraph: {
    title: "Pokemon TCG",
    description:
      "'If you're starving, eat your horses, your dead, or yourself—but NEVER eat your dog.' —General Jarkeld, the Arctic Fox. 🐾 This tool was developed using the Static Site Generation (SSG) concept with Next.js in order to index all the dog type cards of the Magic The Gathering for a private collection. 🐶 The source code can be found on github and easily changed to any other parameter.",
    images: [
      {
        url: "https://lands-of-mtg.bermeo.dev/icons/favicon-3000x3000.png",
        width: 3000,
        height: 3000,
      },
    ],
  },
};

type HomeProps = {
  cardCollection: PokemonTCG.Card[];
};

export default async function Home() {
  const { cardCollection } = await getData();

  return (
    <div className="p-4">
      <div className="text-white mb-4">
        Total: {cardCollection.length} cards |{" "}
        {Math.ceil(cardCollection.length / 9)} pages
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {cardCollection.map((card, index) => (
          <div key={index} className="flex flex-col gap-2">
            <p className="text-white text-sm font-normal">
              #{card?.nationalPokedexNumbers![0]} (index: {index + 1}) page:
              {Math.ceil(index / 9)}
            </p>

            <p className="text-white text-xs">
              $ {card.tcgplayer?.prices.normal?.high} / ${" "}
              {card.tcgplayer?.prices.normal?.market} / ${" "}
              {card.tcgplayer?.prices.holofoil?.high} / ${" "}
              {card.tcgplayer?.prices.holofoil?.market}
            </p>

            <a
              href={card.images.large}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-90 transition-opacity"
            >
              <img
                src={card.images.small}
                alt={`${card.name} (${card.id}) ${card?.flavorText}`}
                loading="lazy"
                className="rounded-lg w-full"
              />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

async function getData() {
  const pichuCleffaIgglybuff = await loadCards(172, 174);
  const crobat = await loadCards(169);
  const bellossom = await loadCards(182);
  const annihilape = await loadCards(979);
  const politoed = await loadCards(186);
  const slowking = await loadCards(199);
  const magnezone = await loadCards(462);
  const steelix = await loadCards(208);
  const tyrogue = await loadCards(236);
  const hitmontop = await loadCards(237);
  const lickilicky = await loadCards(463);
  const rhyperior = await loadCards(464);
  const happiny = await loadCards(440);
  const blissey = await loadCards(242);
  const tangrowth = await loadCards(465);
  const kingdra = await loadCards(230);
  const mimeJr = await loadCards(439);
  const mrRime = await loadCards(866);
  const scizor = await loadCards(212);
  const kleavor = await loadCards(900);
  const smoochum = await loadCards(238);
  const elekid = await loadCards(239);
  const electivire = await loadCards(466);
  const magby = await loadCards(240);
  const magmortar = await loadCards(467);
  const espeonUmbreon = await loadCards(196, 197);
  const leafeonGlaceon = await loadCards(470, 471);
  const sylveon = await loadCards(700);
  const porygon2 = await loadCards(233);
  const porygonZ = await loadCards(474);
  const munchlax = await loadCards(446);
  const perrserker = await loadCards(863);

  const cardCollection: PokemonTCG.Card[] = [
    ...pichuCleffaIgglybuff,
    ...crobat,
    ...bellossom,
    ...annihilape,
    ...politoed,
    ...slowking,
    ...magnezone,
    ...steelix,
    ...tyrogue,
    ...hitmontop,
    ...lickilicky,
    ...rhyperior,
    ...happiny,
    ...blissey,
    ...tangrowth,
    ...kingdra,
    ...mimeJr,
    ...mrRime,
    ...scizor,
    ...kleavor,
    ...smoochum,
    ...elekid,
    ...electivire,
    ...magby,
    ...magmortar,
    ...espeonUmbreon,
    ...leafeonGlaceon,
    ...sylveon,
    ...porygon2,
    ...porygonZ,
    ...munchlax,
    ...perrserker,
  ];

  cardCollection.sort(
    (a, b) =>
      a.nationalPokedexNumbers![0] - b.nationalPokedexNumbers![0] ||
      a.hp?.localeCompare(b.hp!) ||
      b.set.releaseDate.localeCompare(a.set.releaseDate)
  );

  return {
    cardCollection,
  };
}
