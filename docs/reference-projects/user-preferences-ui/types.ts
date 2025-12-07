export type PreferenceOption = {
  id: string;
  title: string;
  description: string;
  iconType: "check" | "question" | "x";
};

export type HostingStatus = "can-host" | "may-host" | "cant-host";
export type MeetupStatus = "wants-meet" | "open-meet" | "cant-meet";
