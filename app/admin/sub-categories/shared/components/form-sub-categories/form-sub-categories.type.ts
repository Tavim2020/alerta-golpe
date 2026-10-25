import { IAutocompleteOption } from "@/components/form/controlled-autocomplete/components/autocomplete/autocomplete.type";
import { FormSubCategoriesSchema } from "./schemas/form-sub-categories.schema";
import { ISubcategory } from "@/types/global.type";

export interface IFormSubCategoriesProps {
  subCategory?: ISubcategory;
  submit: (data: FormSubCategoriesSchema) => void;
  isPending: boolean;
  allCategoriesOptions: IAutocompleteOption[];
}
