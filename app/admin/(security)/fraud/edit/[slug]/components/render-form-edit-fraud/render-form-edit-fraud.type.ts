import { IAutocompleteOption } from "@/components/form/controlled-autocomplete/components/autocomplete/autocomplete.type";
import { TSubCategoriesOptions } from "@/libs/supabase/sub-categories/get-sub-categories";
import { TFraud } from "@/types/global.type";

export interface IRenderFormEditFraudProps {
  fraud: TFraud;
  slug: string;
  allCategoriesOptions: IAutocompleteOption[];
  allSubCategoriesOptions: TSubCategoriesOptions[];
}
