import type { JSX } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CollectionView } from "@components";
import { collectionMetadata, loadCollection, subtypeCollections } from "@lib";

// Statically generate every subtype collection; refresh weekly (ISR).
export const revalidate = 604800;
export const dynamicParams = false;

type Params = { subtype: string };

export function generateStaticParams(): Params[] {
  return subtypeCollections.map((collection) => ({ subtype: collection.slug }));
}

export async function generateMetadata({
  params,
}: Readonly<{ params: Promise<Params> }>): Promise<Metadata> {
  const { subtype } = await params;
  const config = subtypeCollections.find((entry) => entry.slug === subtype);
  return config ? collectionMetadata(config) : {};
}

export default async function SubtypePage({
  params,
}: Readonly<{ params: Promise<Params> }>): Promise<JSX.Element> {
  const { subtype } = await params;
  const config = subtypeCollections.find((entry) => entry.slug === subtype);
  if (!config) notFound();

  const cards = await loadCollection(config);
  return <CollectionView config={config} cards={cards} />;
}
