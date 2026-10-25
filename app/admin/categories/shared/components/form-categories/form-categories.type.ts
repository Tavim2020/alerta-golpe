import { FormCategoriesSchema } from "./schemas/form-categories.schema";

export interface IFormCategoriesProps {
  category?: FormCategoriesSchema;
  submit: (data: FormCategoriesSchema) => void;
  isPending: boolean;
}
