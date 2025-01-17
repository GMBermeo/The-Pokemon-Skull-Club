import { PokemonTCG } from "pokemon-tcg-sdk-typescript";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bones Collection",
  description:
    "'If you're starving, eat your horses, your dead, or yourself—but NEVER eat your dog.' —General Jarkeld, the Arctic Fox...",
  openGraph: {
    url: "https://pokemon-tcg.bermeo.dev/",
    locale: "en_US",
  },
};

async function getBonesCollection() {
  return await PokemonTCG.findCardsByQueries({
    q: "nationalPokedexNumbers:[104 TO 105] -set.id:mcd*",
    orderBy: "-nationalPokedexNumbers, -hp, -set.releaseDate, -number",
  });
}

export default async function BonesCollectionPage() {
  const bonesCollection = await getBonesCollection();

  return (
    <div>
      <div>
        Total: {bonesCollection.length} cards |{" "}
        {Math.ceil(bonesCollection.length / 9)} pages
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {bonesCollection.map((card, index) => (
          <div key={index}>
            <div className="text-white text-sm font-bold">
              #{card?.nationalPokedexNumbers![0]} (index: {index + 1}) page:
              {Math.ceil(index / 9)}
            </div>

            <div className="text-white text-xs">
              $ {card.tcgplayer?.prices.normal?.high} / ${" "}
              {card.tcgplayer?.prices.normal?.market} / ${" "}
              {card.tcgplayer?.prices.holofoil?.high} / ${" "}
              {card.tcgplayer?.prices.holofoil?.market}
            </div>
            <a
              href={card.images.large}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src={card.images.small}
                alt={`${card.name} (${card.id}) ${card?.flavorText}`}
                className="rounded-lg"
              />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
