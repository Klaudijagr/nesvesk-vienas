export type ViewState =
  | "dashboard"
  | "search"
  | "inbox"
  | "profile"
  | "settings";

export type UserStatus =
  | "accepting_guests"
  | "maybe_accepting_guests"
  | "not_accepting_guests"
  | "wants_to_meet_up";

export interface VerificationStatus {
  payment: boolean;
  phone: boolean;
  governmentId: boolean;
  address: "verified" | "pending" | "unverified";
}

export interface User {
  id: string;
  name: string;
  location: string;
  avatarUrl: string;
  coverUrl?: string;
  verification: VerificationStatus;
  referencesCount: number;
  friendsCount: number;
  languages: string[];
  occupation: string;
  education: string; // New field
  interests: string[]; // New field
  age: number;
  gender: string;
  joinedDate: string;
  responseRate: number;
  responseTime: string;
  lastLogin: string;
  status: UserStatus;
}

export interface ProfileExtended extends User {
  aboutMe: string;
  oneAmazingThing: string;
  teachLearnShare: string;
  whyImOnCouchsurfing: string;
  musicMoviesBooks: string;
  countriesVisited: string[];
  countriesLived: string[];
  homeDetails: {
    maxGuests: number;
    lastMinute: boolean;
    preferredGender: string;
    kidFriendly: boolean;
    petFriendly: boolean;
    smokingAllowed: boolean;
    hasPets: boolean;
    hasChildren: boolean;
    sleepingArrangements: string;
    roommateSituation: string;
    publicTransport: string;
    wheelchairAccessible: boolean;
  };
  photos: string[];
  references: Reference[];
}

export interface Reference {
  id: string;
  authorName: string;
  authorAvatar: string;
  authorLocation: string;
  type: "Surfer" | "Host" | "Personal";
  text: string;
  date: string;
  isPositive: boolean;
  response?: string; // New field
  responseDate?: string; // New field
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  isRead: boolean;
}

export interface Conversation {
  id: string;
  otherUser: User;
  lastMessage: string;
  lastMessageDate: string;
  status: "active" | "archived";
  requestType?: "host" | "meetup";
  isRequest?: boolean;
  isBlocked?: boolean; // New field
  labels?: string[]; // New field
  messages: Message[];
  notes?: string;
}

export interface SettingsState {
  email: string;
  phone: string;
  emergencyContact: {
    name: string;
    phone: string;
    email: string;
    notes: string;
  };
}
