import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Artists of Pokémon TCG",
  description:
    "'If you're starving, eat your horses, your dead, or yourself—but NEVER eat your dog.' —General Jarkeld, the Arctic Fox. 🐾 This tool was developed using the Static Site Generation (SSG) concept with Next.js in order to index all the dog type cards of the Magic The Gathering for a private collection. 🐶 The source code can be found on github and easily changed to any other parameter.",
  openGraph: {
    title: "Pokemon TCG",
    description:
      "'If you're starving, eat your horses, your dead, or yourself—but NEVER eat your dog.' —General Jarkeld, the Arctic Fox. 🐾 This tool was developed using the Static Site Generation (SSG) concept with Next.js in order to index all the dog type cards of the Magic The Gathering for a private collection. 🐶 The source code can be found on github and easily changed to any other parameter.",
    images: [
      {
        url: "https://lands-of-mtg.bermeo.dev/icons/favicon-3000x3000.png",
        width: 3001,
        height: 3001,
      },
    ],
  },
};

async function getArtists() {
  const artists: string[] = [
    "hasuno",
    "kawayoo",
    "arita",
    "morii",
    "komiya",
    "tokiya",
    "sowsow",
    "naoki",
    "kagemaru",
    "kusube",
    "ariga",
    "asako",
    "nishida",
    "kudo",
    "adachi",
    "egawa",
  ];

  return artists;
}

export default async function ArtistsPage() {
  const artists = await getArtists();

  return (
    <div className="container mx-auto max-w-xs px-4">
      <ul className="space-y-2">
        {artists.map((artist) => (
          <li key={artist}>
            <Link
              href={`/art/${artist}`}
              className="block border border-white rounded p-3 hover:bg-white/10 transition-colors"
            >
              <p className="text-center font-light capitalize">{artist}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
