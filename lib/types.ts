// Type definitions matching Convex schema

export type UserRole = "host" | "guest" | "both";

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

export type HolidayDate = "24 Dec" | "25 Dec" | "26 Dec" | "31 Dec";

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
  "24 Dec",
  "25 Dec",
  "26 Dec",
  "31 Dec",
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
