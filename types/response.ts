export interface Response {
  data: Card[];
  page: number;
  pageSize: number;
  count: number;
  totalCount: number;
}

export interface Card {
  id: string;
  name: string;
  supertype: Supertype;
  subtypes: Subtype[];
  hp: string;
  types: RetreatCost[];
  evolvesTo: EvolvesTo[];
  attacks: Attack[];
  weaknesses: Resistance[];
  retreatCost: RetreatCost[];
  convertedRetreatCost: number;
  set: Set;
  number: string;
  artist: string;
  rarity?: Rarity;
  flavorText?: string;
  nationalPokedexNumbers: number[];
  legalities: Legalities;
  images: CardImages;
  tcgplayer?: Tcgplayer;
  cardmarket?: Cardmarket;
  level?: string;
  resistances?: Resistance[];
  abilities?: Ability[];
  regulationMark?: string;
}

export interface Ability {
  name: string;
  text: string;
  type: string;
}

export interface Attack {
  name: string;
  cost: RetreatCost[];
  convertedEnergyCost: number;
  damage: string;
  text: string;
}

export enum RetreatCost {
  Colorless = "Colorless",
  Fighting = "Fighting",
}

export interface Cardmarket {
  url: string;
  updatedAt: UpdatedAt;
  prices: { [key: string]: number };
}

export enum UpdatedAt {
  The20230311 = "2023/03/11",
}

export enum EvolvesTo {
  Marowak = "Marowak",
}

export interface CardImages {
  small: string;
  large: string;
}

export interface Legalities {
  unlimited: Expanded;
  expanded?: Expanded;
  standard?: Expanded;
}

export enum Expanded {
  Legal = "Legal",
}

export enum Rarity {
  Common = "Common",
}

export interface Resistance {
  type: Type;
  value: string;
}

export enum Type {
  Grass = "Grass",
  Lightning = "Lightning",
  Water = "Water",
}

export interface Set {
  id: string;
  name: string;
  series: string;
  printedTotal: number;
  total: number;
  legalities: Legalities;
  ptcgoCode?: string;
  releaseDate: string;
  updatedAt: string;
  images: SetImages;
}

export interface SetImages {
  symbol: string;
  logo: string;
}

export enum Subtype {
  Basic = "Basic",
}

export enum Supertype {
  Pokémon = "Pokémon",
}

export interface Tcgplayer {
  url: string;
  updatedAt: UpdatedAt;
  prices: Prices;
}

export interface Prices {
  normal?: The1_StEdition;
  reverseHolofoil?: The1_StEdition;
  "1stEdition"?: The1_StEdition;
  unlimited?: The1_StEdition;
}

export interface The1_StEdition {
  low: number;
  mid: number;
  high: number;
  market: number;
  directLow: number | null;
}
