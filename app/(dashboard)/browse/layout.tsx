import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Browse Hosts & Guests",
  description:
    "Find hosts offering holiday hospitality or guests looking for a place to celebrate in Lithuania. Connect with people for Christmas and New Year celebrations.",
  openGraph: {
    title: "Browse Hosts & Guests | Nešvęsk vienas",
    description:
      "Find hosts offering holiday hospitality or guests looking for a place to celebrate in Lithuania.",
  },
};

const BrowseLayout = ({ children }: { children: React.ReactNode }) => children;

export default BrowseLayout;
