import { IAutocompleteOption } from "@/components/form/controlled-autocomplete/components/autocomplete/autocomplete.type";
import { FormSubCategoriesSchema } from "./schemas/form-sub-categories.schema";

export interface IFormSubCategoriesProps {
  subCategory?: FormSubCategoriesSchema;
  submit: (data: FormSubCategoriesSchema) => void;
  isPending: boolean;
  allCategoriesOptions: IAutocompleteOption[];
}
