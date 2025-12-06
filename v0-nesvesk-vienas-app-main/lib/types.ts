export type UserRole = 'host' | 'guest';

export type InvitationStatus = 'pending' | 'accepted' | 'declined' | 'cancelled';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  age: number;
  phone?: string;
  role: UserRole;
  emailVerified: boolean;
  phoneVerified: boolean;
  completedMeetupsCount: number;
  createdAt: Date;
}

export interface HostProfile {
  userId: string;
  city: string;
  district?: string;
  languages: string[];
  capacity: number;
  availableDates: string[];
  dietary: string[];
  alcoholPolicy: 'none' | 'light' | 'allowed';
  atmosphere: 'quiet' | 'games' | 'lively';
  hasPets: boolean;
  hasKids: boolean;
  description: string;
}

export interface GuestProfile {
  userId: string;
  city: string;
  district?: string;
  groupSize: number;
  availableDates: string[];
  languages: string[];
  dietary: string[];
  lookingFor: 'quiet' | 'games' | 'lively';
  description: string;
}

export interface Invitation {
  id: string;
  fromUserId: string;
  toUserId: string;
  dates: string[];
  message?: string;
  status: InvitationStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface Meetup {
  id: string;
  hostUserId: string;
  guestUserId: string;
  date: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  hostConfirmed?: boolean;
  guestConfirmed?: boolean;
  createdAt: Date;
}
