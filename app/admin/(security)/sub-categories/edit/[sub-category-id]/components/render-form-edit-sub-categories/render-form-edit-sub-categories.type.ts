import { FormSubCategoriesSchema } from "@/app/admin/(security)/sub-categories/shared/components/form-sub-categories/schemas/form-sub-categories.schema";
import { IAutocompleteOption } from "@/components/form/controlled-autocomplete/components/autocomplete/autocomplete.type";

export interface IRenderFormSubCategoriesProps {
  subCategoryId: string;
  subCategory: FormSubCategoriesSchema;
  allCategoriesOptions: IAutocompleteOption[];
}
