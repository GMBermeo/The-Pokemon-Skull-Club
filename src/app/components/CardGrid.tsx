"use client";
import { PokemonTCG } from "pokemon-tcg-sdk-typescript";

type CardGridProps = {
  cardCollection: PokemonTCG.Card[];
};

export function CardGrid({ cardCollection }: Readonly<CardGridProps>) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 auto-rows-auto">
      {cardCollection.map((card, index) => (
        <div key={index} className="flex flex-col gap-2">
          <p className="text-white text-sm font-normal">
            #{card?.nationalPokedexNumbers?.[0]} (index: {index + 1}) page:
            {Math.ceil(index / 9) + 3}
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
  );
}
