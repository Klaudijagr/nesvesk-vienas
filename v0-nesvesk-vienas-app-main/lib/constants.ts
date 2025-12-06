export const LITHUANIAN_CITIES = [
  'Akmene',
  'Alytus',
  'Anyksciai',
  'Ariogala',
  'Birstonas',
  'Birzai',
  'Daugai',
  'Druskininkai',
  'Dukstas',
  'Dusetos',
  'Elektrenai',
  'Ezerelis',
  'Gargzdai',
  'Gelgaudiskis',
  'Grigiskes',
  'Ignalina',
  'Jonava',
  'Joniskis',
  'Jurbarkas',
  'Jieznas',
  'Kaisiadorys',
  'Kalvarija',
  'Kaunas',
  'Kazlu Ruda',
  'Kedainiai',
  'Kelme',
  'Klaipeda',
  'Kretinga',
  'Kupiskis',
  'Kursenai',
  'Lazdijai',
  'Lentvaris',
  'Mazeikiai',
  'Marijampole',
  'Moletai',
  'Nemencine',
  'Naujoji Akmene',
  'Pagegiai',
  'Pakruojis',
  'Palanga',
  'Panevezys',
  'Pasvalys',
  'Plunge',
  'Prienai',
  'Radviliskis',
  'Raseiniai',
  'Rietavas',
  'Rokiskis',
  'Skuodas',
  'Sakiai',
  'Salcininkai',
  'Siauliai',
  'Silale',
  'Silute',
  'Sirvintos',
  'Svencioneliai',
  'Svencionys',
  'Taurage',
  'Telsiai',
  'Trakai',
  'Ukmerge',
  'Utena',
  'Varena',
  'Vievis',
  'Vilkaviskis',
  'Vilnius',
  'Visaginas',
  'Zarasai',
] as const;

export const VILNIUS_DISTRICTS = [
  'Antakalnis',
  'Avizieniai',
  'Baltupiai',
  'Balsiai',
  'Fabijonis kes',
  'Grigiskes',
  'Justiniskes',
  'Karoliniskes',
  'Lazdynai',
  'Lazdyneliai',
  'Naujamiestis',
  'Naujaninkai',
  'Naujoji Vilnia',
  'Pasilaiciai',
  'Paneriai',
  'Pilaite',
  'Rasos',
  'Senamiestis',
  'Seskine',
  'Snipiskes',
  'Verkiai',
  'Vilkpede',
  'Virsulis kes',
  'Zirmunai',
  'Zverynas',
  'Other (specify)',
] as const;

export const KAUNAS_DISTRICTS = [
  'Aleksotas',
  'Centras',
  'Dainava',
  'Eiguliai',
  'Freda',
  'Griciupis',
  'Kalnieciai',
  'Panemune',
  'Petrasiunai',
  'Sanciai',
  'Silainiai',
  'Vilijampole',
  'Zaliakalnis',
  'Other (specify)',
] as const;

export const KLAIPEDA_DISTRICTS = [
  'Baltijos mikrorajonas',
  'Banduziai',
  'Bastionu rajonas',
  'Debrecenas',
  'Centras',
  'Kauno rajonas',
  'Melnrage',
  'Miesto Centras',
  'Nemunas',
  'Pempininkai',
  'Poilsis',
  'Rumpiske',
  'Smiltele',
  'Smiltyne',
  'Siaures miestelis',
  'Vingis',
  'Zarde',
  'Other (specify)',
] as const;

export const SIAULIAI_DISTRICTS = [
  'Centras',
  'Dainiai',
  'Gubernija',
  'Lieporiai',
  'Medelynas',
  'Pabaliai',
  'Pietinis',
  'Rekyva',
  'Talksa',
  'Zokniai',
  'Other (specify)',
] as const;

export const PANEVEZYS_DISTRICTS = [
  'Centras',
  'Stetiskiai',
  'Savitiskiai',
  'Kniaudiskiai',
  'Rozynas',
  'Tulpiu rajonas',
  'Klaipedos g. rajonas',
  'Nevezio kairysis krantas',
  'Senamiestis',
  'Azuolaiciai',
  'Other (specify)',
] as const;

export const MAJOR_CITIES_WITH_DISTRICTS = [
  'Vilnius',
  'Kaunas',
  'Klaipeda',
  'Siauliai',
  'Panevezys',
] as const;

export function getDistrictsForCity(city: string) {
  switch (city) {
    case 'Vilnius':
      return VILNIUS_DISTRICTS;
    case 'Kaunas':
      return KAUNAS_DISTRICTS;
    case 'Klaipeda':
      return KLAIPEDA_DISTRICTS;
    case 'Siauliai':
      return SIAULIAI_DISTRICTS;
    case 'Panevezys':
      return PANEVEZYS_DISTRICTS;
    default:
      return ['Other (specify)'];
  }
}

export const AVAILABLE_LANGUAGES = [
  { value: 'lt', label: 'Lietuviu' },
  { value: 'en', label: 'English' },
  { value: 'ru', label: 'Russian' },
  { value: 'ua', label: 'Ukrainian' },
] as const;

export const CELEBRATION_DATES = [
  { value: 'dec24', key: 'dec24' as const },
  { value: 'dec25', key: 'dec25' as const },
  { value: 'dec26', key: 'dec26' as const },
  { value: 'dec31', key: 'dec31' as const },
] as const;

export const DIETARY_OPTIONS = [
  { value: 'vegetarian', key: 'vegetarian' as const },
  { value: 'vegan', key: 'vegan' as const },
  { value: 'glutenFree', key: 'glutenFree' as const },
  { value: 'lactoseFree', key: 'lactoseFree' as const },
  { value: 'halal', key: 'halal' as const },
  { value: 'kosher', key: 'kosher' as const },
] as const;

export const ALCOHOL_OPTIONS = [
  { value: 'none', key: 'noAlcohol' as const },
  { value: 'light', key: 'lightAlcohol' as const },
  { value: 'allowed', key: 'alcoholAllowed' as const },
] as const;

export const ATMOSPHERE_OPTIONS = [
  { value: 'quiet', key: 'quietDinner' as const },
  { value: 'games', key: 'boardGames' as const },
  { value: 'lively', key: 'livelySocial' as const },
] as const;
