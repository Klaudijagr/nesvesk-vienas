export type EventData = {
  id: string;
  title: string;
  startDate: string;
  startTime: string;
  location: string;
  description: string;
  imageUrl?: string;
  organizer: string;
};

export type UserProfile = {
  name: string;
  isComplete: boolean;
  avatarUrl: string;
};
