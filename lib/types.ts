// Type definitions matching Convex schema
import type { Id } from "@/convex/_generated/dataModel";

export type UserRole = "host" | "guest" | "both";

export type ConnectionStatus =
  | "none"
  | "pending_sent"
  | "pending_received"
  | "matched"
  | "self";

// Slim profile type matching what listProfiles returns
// Excludes large arrays like photos, amenities, houseRules for bandwidth efficiency
export interface SlimProfile {
  _id: Id<"profiles">;
  _creationTime?: number;
  userId: Id<"users">;
  username?: string;
  firstName: string;
  age: number;
  city: string;
  bio: string;
  photoUrl?: string;
  role: "host" | "guest" | "both";
  hostingStatus?: "can-host" | "may-host" | "cant-host";
  guestStatus?: "looking" | "maybe-guest" | "not-looking";
  languages: string[];
  availableDates: string[];
  hostingDates?: string[];
  guestDates?: string[];
  verified: boolean;
  vibes?: string[];
  dietaryInfo?: string[];
  concept?: "Party" | "Dinner" | "Hangout";
  capacity?: number;
  lastActive?: number;
  smokingAllowed: boolean;
  drinkingAllowed: boolean;
  petsAllowed: boolean;
  hasPets: boolean;
  // Optional connection status (only present when viewing other profiles)
  connectionStatus?: ConnectionStatus;
}

export type City =
  | "Vilnius"
  | "Kaunas"
  | "Klaipėda"
  | "Šiauliai"
  | "Panevėžys"
  | "Alytus"
  | "Marijampolė"
  | "Mažeikiai"
  | "Utena"
  | "Jonava"
  | "Kėdainiai"
  | "Telšiai"
  | "Tauragė"
  | "Ukmergė"
  | "Visaginas"
  | "Palanga"
  | "Plungė"
  | "Kretinga"
  | "Šilutė"
  | "Gargždai"
  | "Radviliškis"
  | "Druskininkai"
  | "Elektrėnai"
  | "Jurbarkas"
  | "Rokiškis"
  | "Kuršėnai"
  | "Biržai"
  | "Vilkaviškis"
  | "Garliava"
  | "Grigiškės"
  | "Lentvaris"
  | "Raseiniai"
  | "Prienai"
  | "Anykščiai"
  | "Kaišiadorys"
  | "Joniškis"
  | "Naujoji Akmenė"
  | "Varėna"
  | "Kelmė"
  | "Šalčininkai"
  | "Pasvalys"
  | "Kupiškis"
  | "Zarasai"
  | "Skuodas"
  | "Kazlų Rūda"
  | "Širvintos"
  | "Molėtai"
  | "Švenčionys"
  | "Ignalina"
  | "Pabradė"
  | "Šilalė"
  | "Neringa"
  | "Pagėgiai"
  | "Other";

export type Language = "Lithuanian" | "English" | "Ukrainian" | "Russian";

export type HolidayDate =
  | "23 Dec"
  | "24 Dec"
  | "25 Dec"
  | "26 Dec"
  | "27 Dec"
  | "28 Dec"
  | "29 Dec"
  | "30 Dec"
  | "31 Dec"
  | "1 Jan"
  | "2 Jan";

export type Concept = "Party" | "Dinner" | "Hangout";

export type InvitationStatus = "pending" | "accepted" | "declined";

export const CITIES: City[] = [
  "Vilnius",
  "Kaunas",
  "Klaipėda",
  "Šiauliai",
  "Panevėžys",
  "Alytus",
  "Marijampolė",
  "Mažeikiai",
  "Utena",
  "Jonava",
  "Kėdainiai",
  "Telšiai",
  "Tauragė",
  "Ukmergė",
  "Visaginas",
  "Palanga",
  "Plungė",
  "Kretinga",
  "Šilutė",
  "Gargždai",
  "Radviliškis",
  "Druskininkai",
  "Elektrėnai",
  "Jurbarkas",
  "Rokiškis",
  "Kuršėnai",
  "Biržai",
  "Vilkaviškis",
  "Garliava",
  "Grigiškės",
  "Lentvaris",
  "Raseiniai",
  "Prienai",
  "Anykščiai",
  "Kaišiadorys",
  "Joniškis",
  "Naujoji Akmenė",
  "Varėna",
  "Kelmė",
  "Šalčininkai",
  "Pasvalys",
  "Kupiškis",
  "Zarasai",
  "Skuodas",
  "Kazlų Rūda",
  "Širvintos",
  "Molėtai",
  "Švenčionys",
  "Ignalina",
  "Pabradė",
  "Šilalė",
  "Neringa",
  "Pagėgiai",
  "Other",
];

export const LANGUAGES: Language[] = [
  "Lithuanian",
  "English",
  "Ukrainian",
  "Russian",
];

export const HOLIDAY_DATES: HolidayDate[] = [
  "23 Dec",
  "24 Dec",
  "25 Dec",
  "26 Dec",
  "27 Dec",
  "28 Dec",
  "29 Dec",
  "30 Dec",
  "31 Dec",
  "1 Jan",
  "2 Jan",
];

export const CONCEPTS: Concept[] = ["Party", "Dinner", "Hangout"];
export const CONCEPT_OPTIONS = CONCEPTS;

export const DIETARY_OPTIONS = [
  "Vegetarian",
  "Vegan",
  "Gluten-free",
  "Lactose-free",
  "No Alcohol",
  "Halal",
  "Kosher",
  "None",
] as const;

export const AMENITIES_OPTIONS = [
  "Board Games",
  "Piano/Music",
  "Video Games",
  "Karaoke",
  "TV/Movies",
  "Outdoor Space",
  "Wheelchair Accessible",
] as const;

export const VIBES_OPTIONS = [
  "Cozy",
  "Lively",
  "Traditional",
  "Modern",
  "Family-friendly",
  "Adult-only",
  "Pet-friendly",
] as const;

export const HOUSE_RULES_OPTIONS = [
  "No shoes inside",
  "Quiet after 10pm",
  "Bring a dish to share",
  "BYOB (Bring your own bottle)",
  "Gift exchange",
] as const;
