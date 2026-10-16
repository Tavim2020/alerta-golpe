import { ReactNode } from "react";

export type RootLayoutProps = Readonly<{
  children: ReactNode;
}>;

export type Video = {
  id: string;
  slug: string;
  title: string;
  video_url: string;
  created_at: string;
};
