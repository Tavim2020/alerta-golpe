import { FormCategoriesSchema } from "@/app/admin/(security)/categories/shared/components/form-categories/schemas/form-categories.schema";

export interface IRenderFormCategoriesProps {
  categoryId: string;
  category: FormCategoriesSchema;
}
