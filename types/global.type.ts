import { IPreventionTipProps } from "@/app/frauds/[slug]/components/prevention-tip/prevention-tip.type";
import { Database } from "@/libs/supabase/types/database.type";
import { ReactNode } from "react";

export type RootLayoutProps = Readonly<{
  children: ReactNode;
}>;

export type TFraud = Omit<
  Database["public"]["Tables"]["frauds"]["Row"],
  "tips"
> & {
  sub_category: {
    id: string;
    name: string;
    category: {
      id: string;
      name: string;
    };
  };
  video_url: string;
  thumbnail_url: string;
  tips: Array<Omit<IPreventionTipProps, "index">>;
};

export type CustomError = {
  name: string;
  action: string;
  message: string;
  statusCode: number;
};

export type TSlugPageParam = Promise<{ slug: string }>;

export type TSlugPageProps = {
  params: TSlugPageParam;
};
