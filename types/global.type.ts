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
export interface IGetUniqueDefaultParam {
  value?: string;
}

export interface IPageParamsProps<GParams> {
  params: Promise<GParams>;
}

export type TServerDefaultResponse<GResponse> =
  | {
      data: GResponse;
      totalPages: number;
      success: true;
    }
  | {
      data?: undefined;
      totalPages?: undefined;
      success: false;
    };

export interface IPageParams {
  page?: string | number;
  search?: string;
}

export interface ISearchParamsDefaultProps {
  searchParams: Promise<IPageParams>;
}

export interface ILawyer {
  id: string;
  name: string;
  bio: string;
  specialty: string[];
  photo_url: string;
}

export interface ISubcategory {
  id: string;
  name: string;
  category_id: string;
}
