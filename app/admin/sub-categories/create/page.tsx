import { getCategoriesOptions } from "@/libs/supabase/categories/get-categories";
import { RenderCreateSubCategories } from "./components/render-create-sub-categories";

const CreateSubCategoryPage = async () => {
  const { success, data: allCategoriesOptions } = await getCategoriesOptions();

  if (!success) throw new Error("Tivemos problemas ao buscar as informações.");

  return (
    <RenderCreateSubCategories allCategoriesOptions={allCategoriesOptions} />
  );
};

export default CreateSubCategoryPage;
