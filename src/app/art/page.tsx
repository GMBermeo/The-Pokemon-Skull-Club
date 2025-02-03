"use server";
import { Metadata } from "next";
import Link from "next/link";
import { Body } from "@components";
import { baseMetadata } from "@lib";

const metadata: Metadata = {
  ...baseMetadata,
  title: "Pokémon Card Artists",
  description:
    "Explore the unique styles of Pokémon card artists who made their debut in 2024. Browse through our comprehensive collection of artwork from talented illustrators who bring Pokémon to life in their own distinctive ways.",
  keywords: [
    "pokemon",
    "tcg",
    "artists",
    "illustrators",
    "art",
    "pokemon tcg",
    "card art",
    "card artists",
    "2024 debuts",
  ],
  openGraph: {
    title: "Pokémon Card Artists",
    description:
      "Explore the unique styles of Pokémon card artists who made their debut in 2024. Browse through our comprehensive collection of artwork from talented illustrators who bring Pokémon to life in their own distinctive ways.",
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
    name: "Uninori",
    description:
      "Dynamic illustrator known for energetic manga-inspired artwork, bringing unexpected vigor to Pokémon like Grotle with a distinctive 90s anime aesthetic.",
    href: "/art/uninori",
    bgColor: "bg-blue-100 dark:bg-blue-900",
    hoverColor: "hover:bg-blue-200 dark:hover:bg-blue-800",
    textColor: "text-blue-900 dark:text-blue-100",
  },
  {
    name: "Rond",
    description:
      "Master of soft lines and atmospheric effects, creating regal compositions that bring an ethereal quality to Fire-type Pokémon like Lampent and Ceruledge.",
    href: "/art/rond",
    bgColor: "bg-red-100 dark:bg-red-900",
    hoverColor: "hover:bg-red-200 dark:hover:bg-red-800",
    textColor: "text-red-900 dark:text-red-100",
  },
  {
    name: "Saboteri",
    description:
      "Specialist in atmospheric scenes, particularly excelling in Ghost-type Pokémon illustrations, creating haunting yet charming environments for Poltchageist and Sinistcha.",
    href: "/art/saboteri",
    bgColor: "bg-purple-100 dark:bg-purple-900",
    hoverColor: "hover:bg-purple-200 dark:hover:bg-purple-800",
    textColor: "text-purple-900 dark:text-purple-100",
  },
  {
    name: "mingo",
    description:
      "Innovative artist using bright, groovy color gradients to create vibrant backgrounds that enhance each Pokémon's personality, as seen with Klefki and Floette.",
    href: "/art/mingo",
    bgColor: "bg-pink-100 dark:bg-pink-900",
    hoverColor: "hover:bg-pink-200 dark:hover:bg-pink-800",
    textColor: "text-pink-900 dark:text-pink-100",
  },
  {
    name: "Shimaris Yukichi",
    description:
      "Specializes in adorable interpretations with a focus on round, cute designs against simple backgrounds, perfectly capturing playful moments like Marill's tail play.",
    href: "/art/shimaris-yukichi",
    bgColor: "bg-yellow-100 dark:bg-yellow-900",
    hoverColor: "hover:bg-yellow-200 dark:hover:bg-yellow-800",
    textColor: "text-yellow-900 dark:text-yellow-100",
  },
  {
    name: "osare",
    description:
      "Creator of heavily-rounded, cartoonish illustrations that bring unique personality to each Pokémon form, exemplified in their Tatsugiri variations and Durant ex artwork.",
    href: "/art/osare",
    bgColor: "bg-green-100 dark:bg-green-900",
    hoverColor: "hover:bg-green-200 dark:hover:bg-green-800",
    textColor: "text-green-900 dark:text-green-100",
  },
  {
    name: "Mékayu",
    description:
      "Fairytale-inspired artist creating enchanting storybook scenes, bringing magic to everyday moments like Charcadet's journey and children riding Drampa.",
    href: "/art/mekayu",
    bgColor: "bg-indigo-100 dark:bg-indigo-900",
    hoverColor: "hover:bg-indigo-200 dark:hover:bg-indigo-800",
    textColor: "text-indigo-900 dark:text-indigo-100",
  },
  {
    name: "Yuriko Akase",
    description:
      "Master of slice-of-life scenes depicting Pokémon in everyday situations, starting with Timburr helping build festival stalls and creating heartwarming community moments.",
    href: "/art/yuriko-akase",
    bgColor: "bg-orange-100 dark:bg-orange-900",
    hoverColor: "hover:bg-orange-200 dark:hover:bg-orange-800",
    textColor: "text-orange-900 dark:text-orange-100",
  },
  {
    name: "Yukihiro Tada",
    description:
      "Environmental artist specializing in serene landscapes, from countryside scenes with Pinsir to tropical beaches with Alolan Dugtrio, always featuring distinctive cloud work.",
    href: "/art/yukihiro-tada",
    bgColor: "bg-teal-100 dark:bg-teal-900",
    hoverColor: "hover:bg-teal-200 dark:hover:bg-teal-800",
    textColor: "text-teal-900 dark:text-teal-100",
  },
  {
    name: "Narano",
    description:
      "Innovative artist using swirling colors and fisheye perspectives to create dynamic compositions, bringing joyful energy to flying Pokémon like Togekiss and Castform.",
    href: "/art/narano",
    bgColor: "bg-cyan-100 dark:bg-cyan-900",
    hoverColor: "hover:bg-cyan-200 dark:hover:bg-cyan-800",
    textColor: "text-cyan-900 dark:text-cyan-100",
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
            Discover the unique styles of artists who made their debut in 2024
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
