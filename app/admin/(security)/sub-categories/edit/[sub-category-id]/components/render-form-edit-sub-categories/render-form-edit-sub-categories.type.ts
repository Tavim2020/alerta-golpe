import { IAutocompleteOption } from "@/components/form/controlled-autocomplete/components/autocomplete/autocomplete.type";
import { ISubcategory } from "@/types/global.type";

export interface IRenderFormSubCategoriesProps {
  subCategoryId: string;
  subCategory: ISubcategory;
  allCategoriesOptions: IAutocompleteOption[];
}
