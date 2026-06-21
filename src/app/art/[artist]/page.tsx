import type { JSX } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CollectionView } from "@components";
import { artistCollection, artists, collectionMetadata, loadCollection } from "@lib";

// Statically generate every artist gallery; refresh weekly (ISR).
export const revalidate = 604800;
export const dynamicParams = false;

type Params = { artist: string };

export function generateStaticParams(): Params[] {
  return artists.map((artist) => ({ artist: artist.slug }));
}

export async function generateMetadata({
  params,
}: Readonly<{ params: Promise<Params> }>): Promise<Metadata> {
  const { artist } = await params;
  const entry = artists.find((candidate) => candidate.slug === artist);
  return entry ? collectionMetadata(artistCollection(entry)) : {};
}

export default async function ArtistPage({
  params,
}: Readonly<{ params: Promise<Params> }>): Promise<JSX.Element> {
  const { artist } = await params;
  const entry = artists.find((candidate) => candidate.slug === artist);
  if (!entry) notFound();

  const config = artistCollection(entry);
  const cards = await loadCollection(config);
  return <CollectionView config={config} cards={cards} />;
}
