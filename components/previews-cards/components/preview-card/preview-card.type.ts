import { TFraud } from "@/types/global.type";

export type TPreviewCardVariant = "article" | "fraud";

export interface IPreviewCardProps {
  preview: Partial<TFraud>;
  variant?: TPreviewCardVariant;
}
