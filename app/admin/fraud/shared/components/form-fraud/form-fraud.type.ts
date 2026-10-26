import { TFraud } from "@/types/global.type";
import { FormFraudSchema } from "./schemas/form-fraud.schema";
import { IAutocompleteOption } from "@/components/form/controlled-autocomplete/components/autocomplete/autocomplete.type";
import { TSubCategoriesOptions } from "@/libs/supabase/sub-categories/get-sub-categories";

export interface IFormFraudProps {
  isPending: boolean;
  submit: (data: FormFraudSchema) => void;
  fraud?: TFraud;
  allCategoriesOptions: IAutocompleteOption[];
  allSubCategoriesOptions: TSubCategoriesOptions[];
  allLawyersOptions: IAutocompleteOption[];
}
