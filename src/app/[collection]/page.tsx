import type { JSX } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CollectionView } from "@components";
import { collectionMetadata, loadCollection, pokemonCollections } from "@lib";

// Statically generate every single-Pokémon collection; refresh weekly (ISR).
export const revalidate = 604800;
export const dynamicParams = false;

type Params = { collection: string };

export function generateStaticParams(): Params[] {
  return pokemonCollections.map((collection) => ({ collection: collection.slug }));
}

export async function generateMetadata({
  params,
}: Readonly<{ params: Promise<Params> }>): Promise<Metadata> {
  const { collection } = await params;
  const config = pokemonCollections.find((entry) => entry.slug === collection);
  return config ? collectionMetadata(config) : {};
}

export default async function CollectionPage({
  params,
}: Readonly<{ params: Promise<Params> }>): Promise<JSX.Element> {
  const { collection } = await params;
  const config = pokemonCollections.find((entry) => entry.slug === collection);
  if (!config) notFound();

  const cards = await loadCollection(config);
  return <CollectionView config={config} cards={cards} />;
}
