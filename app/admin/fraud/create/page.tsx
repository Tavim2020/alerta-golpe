import { getCategoriesOptions } from "@/libs/supabase/categories/get-categories";
import { RenderFormCreateFraud } from "./components/render-form-create-fraud";
import { getSubCategoriesOptions } from "@/libs/supabase/sub-categories/get-sub-categories";
import { getLawyersOptions } from "@/libs/supabase/lawyers/get-lawyers";

export default async function CreateFraud() {
  const [
    { success: successCategoryOptions, data: allCategoriesOptions },
    { success: successSubCategoryOptions, data: allSubCategoriesOptions },
    { success: successLawyers, data: allLawyersOptions },
  ] = await Promise.all([
    getCategoriesOptions(),
    getSubCategoriesOptions(),
    getLawyersOptions(),
  ]);

  if (!successCategoryOptions || !successSubCategoryOptions || !successLawyers)
    throw new Error(
      "Tivemos problemas ao buscar as informações de categoria e sub categoria",
    );

  return (
    <RenderFormCreateFraud
      allCategoriesOptions={allCategoriesOptions}
      allSubCategoriesOptions={allSubCategoriesOptions}
      allLawyersOptions={allLawyersOptions}
    />
  );
}
