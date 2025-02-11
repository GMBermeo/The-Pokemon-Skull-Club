"use server";
import { Metadata } from "next";
import Link from "next/link";
import { Body } from "@components";
import { baseMetadata } from "@lib";

const metadata: Metadata = {
  ...baseMetadata,
  title: "Pokémon Card Artists",
  description:
    "Explore the diverse styles of Pokémon card artists, from legendary illustrators to modern masters. Browse through our comprehensive collection of artwork featuring traditional, digital, and unique artistic approaches that bring Pokémon to life.",
  keywords: [
    "pokemon",
    "tcg",
    "artists",
    "illustrators",
    "art",
    "pokemon tcg",
    "card art",
    "card artists",
  ],
  openGraph: {
    title: "Pokémon Card Artists",
    description:
      "Explore the diverse styles of Pokémon card artists, from legendary illustrators to modern masters. Browse through our comprehensive collection of artwork featuring traditional, digital, and unique artistic approaches that bring Pokémon to life.",
    url: "https://pokemon.bermeo.dev/art",
    section: "Card Artists",
    locale: "en_US",
  },
};

export async function generateMetadata(): Promise<Metadata> {
  return metadata;
}

const artists = [
  {
    name: "Mitsuhiro Arita",
    description:
      "Legendary artist who has been with the TCG since the beginning, known for iconic illustrations like Base Set Charizard. His distinctive style combines dynamic poses with detailed backgrounds, creating timeless card artwork that has defined the TCG's visual identity.",
    href: "/art/arita",
    bgColor: "bg-red-100 dark:bg-red-900",
    hoverColor: "hover:bg-red-200 dark:hover:bg-red-800",
    textColor: "text-red-900 dark:text-red-100",
  },
  {
    name: "Akira Egawa",
    description:
      "Master of dramatic compositions and lighting effects, known for creating powerful, emotionally resonant scenes. Their artwork often features striking contrasts and dynamic character interactions that bring intensity to each card.",
    href: "/art/akira",
    bgColor: "bg-blue-100 dark:bg-blue-900",
    hoverColor: "hover:bg-blue-200 dark:hover:bg-blue-800",
    textColor: "text-blue-900 dark:text-blue-100",
  },
  {
    name: "Asako Ito",
    description:
      "Innovative artist who brings Pokémon to life through unique amigurumi (3D crochet) illustrations. Her handcrafted designs transform Pokémon into adorable crocheted creatures, creating a distinctive and charming style.",
    href: "/art/asaka",
    bgColor: "bg-pink-100 dark:bg-pink-900",
    hoverColor: "hover:bg-pink-200 dark:hover:bg-pink-800",
    textColor: "text-pink-900 dark:text-pink-100",
  },
  {
    name: "Yoriyuki Ikegami",
    description:
      "Artist with a green thumb, consistently incorporating beautiful floral settings with the Pokémon that inhabit them. Debuted in Crown Zenith with Gardenia's Vigor, showcasing vibrant portrayals of Grass-type Pokémon among stunning flora.",
    href: "/art/ikegami",
    bgColor: "bg-emerald-100 dark:bg-emerald-900",
    hoverColor: "hover:bg-emerald-200 dark:hover:bg-emerald-800",
    textColor: "text-emerald-900 dark:text-emerald-100",
  },
  {
    name: "Jerky",
    description:
      "Prolific new artist known for whimsical depictions of Pokémon in their everyday lives. Their playful art style channels papercraft with construction paper-like textures and soft colors, bringing charm to each illustration.",
    href: "/art/jerky",
    bgColor: "bg-amber-100 dark:bg-amber-900",
    hoverColor: "hover:bg-amber-200 dark:hover:bg-amber-800",
    textColor: "text-amber-900 dark:text-amber-100",
  },
  {
    name: "kantaro",
    description:
      "Storytelling master who debuted in Crown Zenith, known for bright colors and vivid settings. Their artwork often showcases the evolving bonds between Trainers and Pokémon through everyday moments like shopping trips.",
    href: "/art/kantaro",
    bgColor: "bg-violet-100 dark:bg-violet-900",
    hoverColor: "hover:bg-violet-200 dark:hover:bg-violet-800",
    textColor: "text-violet-900 dark:text-violet-100",
  },
  {
    name: "Mékayu",
    description:
      "Creates enchanting artwork with a distinctive storybook-inspired style, bringing a fairytale aesthetic to the Pokémon world. Their illustrations create magical scenes that capture the imagination with whimsical details.",
    href: "/art/mekayu",
    bgColor: "bg-purple-100 dark:bg-purple-900",
    hoverColor: "hover:bg-purple-200 dark:hover:bg-purple-800",
    textColor: "text-purple-900 dark:text-purple-100",
  },
  {
    name: "MINAMINAMI Take",
    description:
      "Debuted with a charming promo card showing Charmander watching a Pidgey through glass. Their impressionist-inspired style brings a fresh perspective to Pokémon interactions, creating heartwarming moments between different species.",
    href: "/art/minaminami",
    bgColor: "bg-rose-100 dark:bg-rose-900",
    hoverColor: "hover:bg-rose-200 dark:hover:bg-rose-800",
    textColor: "text-rose-900 dark:text-rose-100",
  },
  {
    name: "mingo",
    description:
      "Innovative artist using bright, groovy color gradients to create vibrant backgrounds that enhance each Pokémon's personality. Their work with Klefki and Floette showcases a modern, pop-art influenced style.",
    href: "/art/mingo",
    bgColor: "bg-orange-100 dark:bg-orange-900",
    hoverColor: "hover:bg-orange-200 dark:hover:bg-orange-800",
    textColor: "text-orange-900 dark:text-orange-100",
  },
  {
    name: "Yuka Morii",
    description:
      "Specialist in clay model artwork, creating charming 3D representations of Pokémon. Her unique approach brings a tactile, handcrafted quality to the cards, making each Pokémon appear tangible and full of personality.",
    href: "/art/morii",
    bgColor: "bg-yellow-100 dark:bg-yellow-900",
    hoverColor: "hover:bg-yellow-200 dark:hover:bg-yellow-800",
    textColor: "text-yellow-900 dark:text-yellow-100",
  },
  {
    name: "Oku",
    description:
      "Master of contrast who debuted with a striking Scizor illustration. Their artwork emphasizes dramatic light and shadow effects, creating intense battle scenes and atmospheric environments that bring Pokémon to life.",
    href: "/art/oku",
    bgColor: "bg-slate-100 dark:bg-slate-900",
    hoverColor: "hover:bg-slate-200 dark:hover:bg-slate-800",
    textColor: "text-slate-900 dark:text-slate-100",
  },
  {
    name: "osare",
    description:
      "Distinguished by their unique rounded, cartoonish style that infuses each Pokémon with distinct personality. Their artwork demonstrates a modern approach to character design while maintaining the classic charm of the TCG.",
    href: "/art/osare",
    bgColor: "bg-indigo-100 dark:bg-indigo-900",
    hoverColor: "hover:bg-indigo-200 dark:hover:bg-indigo-800",
    textColor: "text-indigo-900 dark:text-indigo-100",
  },
  {
    name: "REND",
    description:
      "Winner of the 2022 Pokémon Illustration Contest with their sleepy Arcanine artwork. Their style features soft lighting and natural scenes that perfectly capture the daily life of Pokémon in their environments.",
    href: "/art/rend",
    bgColor: "bg-neutral-100 dark:bg-neutral-900",
    hoverColor: "hover:bg-neutral-200 dark:hover:bg-neutral-800",
    textColor: "text-neutral-900 dark:text-neutral-100",
  },
  {
    name: "rika",
    description:
      "Emerging artist known for their watercolor-inspired illustrations that bring depth and atmosphere to each scene. Debuted with a moonlit Umbreon, their style creates immersive environments that draw viewers into the Pokémon world.",
    href: "/art/rika",
    bgColor: "bg-sky-100 dark:bg-sky-900",
    hoverColor: "hover:bg-sky-200 dark:hover:bg-sky-800",
    textColor: "text-sky-900 dark:text-sky-100",
  },
  {
    name: "Rond",
    description:
      "Master of soft lines and atmospheric effects, creating regal compositions that bring an ethereal quality to Fire-type Pokémon like Lampent and Ceruledge. Their work features elegant color gradients and mystical environments.",
    href: "/art/rond",
    bgColor: "bg-rose-100 dark:bg-rose-900",
    hoverColor: "hover:bg-rose-200 dark:hover:bg-rose-800",
    textColor: "text-rose-900 dark:text-rose-100",
  },
  {
    name: "Saboteri",
    description:
      "Specialist in atmospheric scenes, particularly excelling in Ghost-type Pokémon illustrations. Creates haunting yet charming environments for Pokémon like Poltchageist and Sinistcha, with masterful use of lighting and mood.",
    href: "/art/saboteri",
    bgColor: "bg-cyan-100 dark:bg-cyan-900",
    hoverColor: "hover:bg-cyan-200 dark:hover:bg-cyan-800",
    textColor: "text-cyan-900 dark:text-cyan-100",
  },
  {
    name: "Tetsu Kayama",
    description:
      "Innovative artist who brings a unique pointillism-inspired style to the TCG. Their artwork provides rich textures and fresh perspectives on classic Pokémon, as seen in their debut with Lunatone and Solrock illustrations.",
    href: "/art/kayama",
    bgColor: "bg-zinc-100 dark:bg-zinc-900",
    hoverColor: "hover:bg-zinc-200 dark:hover:bg-zinc-800",
    textColor: "text-zinc-900 dark:text-zinc-100",
  },
  {
    name: "toriyufu",
    description:
      "Dynamic artist who emphasizes movement through thematic action lines, as showcased in their debut illustrations of Entei and Aegislash ex. Their unique approach brings energy and flow to each Pokémon illustration.",
    href: "/art/toriyufu",
    bgColor: "bg-stone-100 dark:bg-stone-900",
    hoverColor: "hover:bg-stone-200 dark:hover:bg-stone-800",
    textColor: "text-stone-900 dark:text-stone-100",
  },
  {
    name: "Uninori",
    description:
      "Dynamic illustrator known for energetic manga-inspired artwork, bringing unexpected vigor to Pokémon with a distinctive 90s anime aesthetic. Their style emphasizes movement and expression in every illustration.",
    href: "/art/uninori",
    bgColor: "bg-teal-100 dark:bg-teal-900",
    hoverColor: "hover:bg-teal-200 dark:hover:bg-teal-800",
    textColor: "text-teal-900 dark:text-teal-100",
  },
  {
    name: "USGMEN",
    description:
      "Social media sensation known for their distinctive style featuring simple yet expressive faces with dot eyes and straight-line mouths. Their upcoming TCG debut with Mew ex promises to bring their fresh and cute perspective to the cards.",
    href: "/art/usgmen",
    bgColor: "bg-lime-100 dark:bg-lime-900",
    hoverColor: "hover:bg-lime-200 dark:hover:bg-lime-800",
    textColor: "text-lime-900 dark:text-lime-100",
  },
  {
    name: "Shimaris Yukichi",
    description:
      "Specializes in adorable interpretations with a focus on round, cute designs against simple backgrounds. Their art style perfectly captures playful moments, emphasizing the charming aspects of each Pokémon.",
    href: "/art/yukichi",
    bgColor: "bg-emerald-100 dark:bg-emerald-900",
    hoverColor: "hover:bg-emerald-200 dark:hover:bg-emerald-800",
    textColor: "text-emerald-900 dark:text-emerald-100",
  },
  {
    name: "Yukihiro Tada",
    description:
      "Environmental artist specializing in serene landscapes, creating peaceful scenes where Pokémon exist in harmony with their surroundings. Known for distinctive cloud work and tranquil natural settings from countryside scenes to tropical beaches.",
    href: "/art/yukihiro",
    bgColor: "bg-fuchsia-100 dark:bg-fuchsia-900",
    hoverColor: "hover:bg-fuchsia-200 dark:hover:bg-fuchsia-800",
    textColor: "text-fuchsia-900 dark:text-fuchsia-100",
  },
  {
    name: "Yuriko Akase",
    description:
      "Master of slice-of-life scenes depicting Pokémon in everyday situations, creating heartwarming community moments. Their artwork often shows Pokémon helping humans or engaging in daily activities with a gentle, narrative touch.",
    href: "/art/yuriko",
    bgColor: "bg-lime-100 dark:bg-lime-900",
    hoverColor: "hover:bg-lime-200 dark:hover:bg-lime-800",
    textColor: "text-lime-900 dark:text-lime-100",
  },
];

export default async function ArtistsPage() {
  return (
    <Body className="bg-gray-50 dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Pokémon Card Artists
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Discover the unique styles of Pokémon TCG&apos;s most talented
            illustrators
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {artists.map((artist) => (
            <Link
              key={artist.name}
              href={artist.href}
              className={`${artist.bgColor} ${artist.hoverColor} rounded-lg p-6 transition-colors duration-200 shadow-lg`}
            >
              <div className="h-full flex flex-col justify-between">
                <div>
                  <h2 className={`text-2xl font-bold mb-2 ${artist.textColor}`}>
                    {artist.name}
                  </h2>
                  <p className={`${artist.textColor} opacity-90`}>
                    {artist.description}
                  </p>
                </div>
                <div className={`mt-4 text-sm font-medium ${artist.textColor}`}>
                  View Collection →
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </Body>
  );
}
