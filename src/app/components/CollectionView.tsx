import type { JSX } from "react";
import type { PokemonTCG } from "@pokelib/pokemon-tcg-sdk-typescript";
import type { CollectionConfig } from "@lib";
import { Body } from "./Body";
import { Header } from "./Header";
import { CardGrid } from "./CardGrid";

type CollectionViewProps = {
  config: CollectionConfig;
  cards: PokemonTCG.ICard[];
};

/** Shared rendering for every collection-style page (themed grid of cards). */
export function CollectionView({
  config,
  cards,
}: Readonly<CollectionViewProps>): JSX.Element {
  return (
    <Body className={config.theme}>
      <Header
        title={config.headerTitle}
        subtitle={config.subtitle}
        totalCards={cards.length}
        slotsPerPage={config.slotsPerPage}
      />
      <CardGrid cardCollection={cards} />
    </Body>
  );
}
