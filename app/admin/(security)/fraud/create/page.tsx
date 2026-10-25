import { getCategoriesOptions } from "@/libs/supabase/categories/get-categories";
import { RenderFormCreateFraud } from "./components/render-form-create-fraud";
import { getSubCategoriesOptions } from "@/libs/supabase/sub-categories/get-sub-categories";

export default async function CreateFraud() {
  const [
    { success: successCategoryOptions, data: allCategoriesOptions },
    { success: successSubCategoryOptions, data: allSubCategoriesOptions },
  ] = await Promise.all([getCategoriesOptions(), getSubCategoriesOptions()]);

  if (!successCategoryOptions || !successSubCategoryOptions)
    throw new Error(
      "Tivemos problemas ao buscar as informações de categoria e sub categoria",
    );

  return (
    <RenderFormCreateFraud
      allCategoriesOptions={allCategoriesOptions}
      allSubCategoriesOptions={allSubCategoriesOptions}
    />
  );
}
