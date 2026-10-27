import { ILawyer } from "@/types/global.type";

export interface ILawyerCardProps extends ILawyer {
  fraudTitle: string;
  fraudSlug: string;
}
