import { fetchQuery } from "convex/nextjs";
import type { Metadata } from "next";

import { api } from "@/convex/_generated/api";

interface Props {
  params: Promise<{ username: string }>;
  children: React.ReactNode;
}

export const generateMetadata = async ({
  params,
}: Props): Promise<Metadata> => {
  const { username } = await params;

  try {
    const profile = await fetchQuery(api.profiles.getProfileByUsername, {
      username,
    });

    if (!profile) {
      return {
        title: "Profile Not Found",
        description: "This profile could not be found.",
      };
    }

    const photoUrl = profile.photoUrl ?? "";
    const title = `${profile.firstName}${profile.city ? ` from ${profile.city}` : ""}`;
    const description = profile.bio
      ? profile.bio.slice(0, 160)
      : `${profile.firstName} is ${profile.role === "host" ? "hosting" : "looking for a host"} for the holidays in Lithuania.`;

    return {
      title,
      description,
      openGraph: {
        title: `${title} | Nešvęsk vienas`,
        description,
        type: "profile",
        ...(photoUrl === ""
          ? {}
          : {
              images: [
                {
                  url: photoUrl,
                  width: 400,
                  height: 400,
                  alt: `${profile.firstName}'s profile photo`,
                },
              ],
            }),
      },
      twitter: {
        card: "summary",
        title: `${title} | Nešvęsk vienas`,
        description,
        ...(photoUrl === "" ? {} : { images: [photoUrl] }),
      },
    };
  } catch {
    return {
      title: "Profile",
      description: "View this profile on Nešvęsk vienas.",
    };
  }
};

const ProfileLayout = ({ children }: Props) => children;

export default ProfileLayout;
