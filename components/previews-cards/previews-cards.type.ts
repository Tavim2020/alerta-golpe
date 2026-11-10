import { TFraud } from "@/types/global.type";
import { TPreviewCardVariant } from "./components/preview-card/preview-card.type";

export interface IPreviewsCardsProps {
  previews: Partial<TFraud>[];
  variant?: TPreviewCardVariant;
}
