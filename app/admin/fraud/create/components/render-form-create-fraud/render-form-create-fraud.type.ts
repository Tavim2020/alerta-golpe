import { IAutocompleteOption } from "@/components/form/controlled-autocomplete/components/autocomplete/autocomplete.type";
import { TSubCategoriesOptions } from "@/libs/supabase/sub-categories/get-sub-categories";

export interface IRenderFormCreateFraudProps {
  allCategoriesOptions: IAutocompleteOption[];
  allSubCategoriesOptions: TSubCategoriesOptions[];
  allLawyersOptions: IAutocompleteOption[];
}
