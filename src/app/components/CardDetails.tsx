import { JSX } from "react";
import { PokemonTCG } from "pokemon-tcg-sdk-typescript";

type CardDetailsProps = {
  card: PokemonTCG.Card;
};

export function CardDetails({ card }: Readonly<CardDetailsProps>): JSX.Element {
  // Format price function (reused from CardGrid)
  const formatPrice = (price?: number | null): string | null => {
    return price ? `$${price.toFixed(2)}` : null;
  };

  // Build price display
  const prices = {
    normal: {
      high: formatPrice(card.tcgplayer?.prices?.normal?.high),
      market: formatPrice(card.tcgplayer?.prices?.normal?.market),
    },
    holofoil: {
      high: formatPrice(card.tcgplayer?.prices?.holofoil?.high),
      market: formatPrice(card.tcgplayer?.prices?.holofoil?.market),
    },
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
      {/* Left Column - Image and Basic Info */}
      <div className="flex flex-col gap-4">
        <a
          href={card.images.large}
          target="_blank"
          rel="noopener noreferrer"
          className="transition-opacity"
        >
          <img
            src={card.images.large}
            alt={`${card.name} (${card.id})`}
            className="rounded-lg w-full"
          />
        </a>

        {/* Basic Card Info */}
      </div>

      {/* Right Column - Card Details */}
      <div className="flex flex-col gap-4">
        <div className="bg-slate-100 dark:bg-slate-700 rounded-lg p-4">
          <h3 className="font-bold mb-2">Card Information</h3>
          <dl className="grid gap-2 text-sm">
            <div className="flex">
              <dt className="font-medium min-w-24">Set:</dt>
              <dd>
                {card.set.name} ({card.set.series})
              </dd>
            </div>
            <div className="flex">
              <dt className="font-medium min-w-24">Number:</dt>
              <dd>
                {card.number}/{card.set.printedTotal}
              </dd>
            </div>
            <div className="flex">
              <dt className="font-medium min-w-24">Rarity:</dt>
              <dd>{card.rarity}</dd>
            </div>
            {card.artist && (
              <div className="flex">
                <dt className="font-medium min-w-24">Artist:</dt>
                <dd>{card.artist}</dd>
              </div>
            )}
            {card.nationalPokedexNumbers && (
              <div className="flex">
                <dt className="font-medium min-w-24">Pokédex:</dt>
                <dd>#{card.nationalPokedexNumbers[0]}</dd>
              </div>
            )}
          </dl>
          {/* Market Prices */}
          {card.tcgplayer && (
            <div className="mt-2 bg-slate-100 dark:bg-slate-800 shadow-inner  rounded-lg p-4">
              <div className="flex justify-between">
                <h3 className="font-bold mb-2">TCGPlayer Prices</h3>
                {card.tcgplayer.updatedAt && (
                  <h4 className="text-sm dark:text-slate-600 text-slate-400">
                    Last updated:{" "}
                    {new Date(card.tcgplayer.updatedAt).toLocaleDateString()}
                  </h4>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                {prices.normal.high ||
                prices.normal.market ||
                prices.holofoil.high ||
                prices.holofoil.market ? (
                  <>
                    <dl>
                      <dt className="font-semibold">Normal</dt>
                      {prices.normal.high && (
                        <dd>High: {prices.normal.high}</dd>
                      )}
                      {prices.normal.market && (
                        <dd>Market: {prices.normal.market}</dd>
                      )}
                    </dl>

                    <dl>
                      <dt className="font-semibold">Holofoil</dt>
                      {prices.holofoil.high && (
                        <dd>High: {prices.holofoil.high}</dd>
                      )}
                      {prices.holofoil.market && (
                        <dd>Market: {prices.holofoil.market}</dd>
                      )}
                    </dl>
                  </>
                ) : (
                  <p>No prices available</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Pokemon Details */}
        <div className="bg-slate-100 dark:bg-slate-700 rounded-lg p-4">
          <h3 className="font-bold mb-2">Pokémon Details</h3>
          <dl className="grid gap-2 text-sm">
            <div className="flex">
              <dt className="font-medium min-w-24">Type:</dt>
              <dd>{card.types?.join(", ")}</dd>
            </div>
            {card.hp && (
              <div className="flex">
                <dt className="font-medium min-w-24">HP:</dt>
                <dd>{card.hp}</dd>
              </div>
            )}
            {card.evolvesFrom && (
              <div className="flex">
                <dt className="font-medium min-w-24">Evolves From:</dt>
                <dd>{card.evolvesFrom}</dd>
              </div>
            )}
            {card.evolvesTo && card.evolvesTo.length > 0 && (
              <div className="flex">
                <dt className="font-medium min-w-24">Evolves To:</dt>
                <dd>{card.evolvesTo.join(", ")}</dd>
              </div>
            )}
            {card.ancientTrait?.name && (
              <div className="flex">
                <dt className="font-medium min-w-24">Ancient Trait:</dt>
                <dd>{card.ancientTrait?.name}</dd>
                <dd>{card.ancientTrait?.text}</dd>
              </div>
            )}
          </dl>
        </div>

        {/* Abilities */}
        {card.abilities && card.abilities.length > 0 && (
          <div className="bg-slate-100 dark:bg-slate-700 rounded-lg p-4">
            <h3 className="font-bold mb-2">Abilities</h3>
            {card.abilities.map((ability, index) => (
              <div key={index} className="mb-2">
                <p className="font-semibold">
                  {ability.name} ({ability.type})
                </p>
                <p className="text-sm">{ability.text}</p>
              </div>
            ))}
          </div>
        )}

        {/* Attacks */}
        {card.attacks && card.attacks.length > 0 && (
          <div className="bg-slate-100 dark:bg-slate-700 rounded-lg p-4">
            <h3 className="font-bold mb-2">Attacks</h3>
            {card.attacks.map((attack, index) => (
              <div key={index} className="mb-3">
                <div className="flex justify-between items-center">
                  <p className="font-semibold">{attack.name}</p>
                  <p className="text-sm">
                    Cost: {attack.cost.join(", ")} ({attack.damage})
                  </p>
                </div>
                <p className="text-sm">{attack.text}</p>
              </div>
            ))}
          </div>
        )}

        {/* Weaknesses and Resistances */}
        <div className="bg-slate-100 dark:bg-slate-700 rounded-lg p-4">
          <h3 className="font-bold mb-2">Battle Stats</h3>
          <dl className="grid gap-2 text-sm">
            {card.weaknesses && (
              <div className="flex">
                <dt className="font-medium min-w-24">Weaknesses:</dt>
                <dd>
                  {card.weaknesses
                    .map((w) => `${w.type} (${w.value})`)
                    .join(", ")}
                </dd>
              </div>
            )}
            {card.resistances && (
              <div className="flex">
                <dt className="font-medium min-w-24">Resistances:</dt>
                <dd>
                  {card.resistances
                    .map((r) => `${r.type} (${r.value})`)
                    .join(", ")}
                </dd>
              </div>
            )}
            {card.retreatCost?.length && (
              <div className="flex">
                <dt className="font-medium min-w-24">Retreat Cost:</dt>
                <dd>{card.retreatCost.length}</dd>
              </div>
            )}
          </dl>
        </div>

        {/* Rules and Flavor Text */}
        {(card.rules || card.flavorText) && (
          <div className="bg-slate-100 dark:bg-slate-700 rounded-lg p-4">
            {card.rules && (
              <>
                <h3 className="font-bold mb-2">Rules</h3>
                <ul className="list-disc list-inside text-sm mb-4">
                  {card.rules.map((rule, index) => (
                    <li key={index}>{rule}</li>
                  ))}
                </ul>
              </>
            )}
            {card.flavorText && (
              <>
                <h3 className="font-bold mb-2">Flavor Text</h3>
                <p className="text-sm italic">{card.flavorText}</p>
              </>
            )}
          </div>
        )}
        {/* API */}
        <div className="bg-slate-100 dark:bg-slate-900 text-slate-100 rounded-lg p-4">
          <dl className="grid gap-2 text-sm">
            {card.supertype && (
              <div className="flex">
                <dt className="font-medium min-w-24">Supertype:</dt>
                <dd>{card.supertype}</dd>
              </div>
            )}
            {card.types && (
              <div className="flex">
                <dt className="font-medium min-w-24">Types:</dt>
                <dd>{card.types.join(", ")}</dd>
              </div>
            )}
            {card.subtypes && (
              <div className="flex">
                <dt className="font-medium min-w-24">Subtypes:</dt>
                <dd>{card.subtypes.join(", ")}</dd>
              </div>
            )}
          </dl>
        </div>
      </div>
    </div>
  );
}
