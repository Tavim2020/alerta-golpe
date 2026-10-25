import { BackButton } from "@/app/admin/(security)/shared/components/back-button";
import { RenderFormEditSubCategories } from "./components/render-form-edit-sub-categories";
import { APP_ROUTE } from "@/routes/app.route";
import { getCategoriesOptions } from "@/libs/supabase/categories/get-categories";
import { getSubCategoryById } from "@/libs/supabase/sub-categories/get-sub-categories";
import { IPageParamsProps } from "@/types/global.type";

const EditSubCategoryPage = async ({
  params,
}: IPageParamsProps<{ "sub-category-id"?: string }>) => {
  const { "sub-category-id": subCategoryId } = await params;

  if (!subCategoryId) throw new Error("Parâmetro não encontrado!");

  const [
    { subCategory },
    { success: successCategoryOptions, data: allCategoriesOptions },
  ] = await Promise.all([
    getSubCategoryById(subCategoryId),
    getCategoriesOptions(),
  ]);

  if (!successCategoryOptions)
    throw new Error("Tivemos problemas ao buscar as informações");

  return (
    <main className="mx-auto w-full max-w-7xl space-y-8 py-8">
      <BackButton
        title="Edição de Sub Categoria"
        href={APP_ROUTE.ADMIN.SUB_CATEGORIES.ROOT()}
      />

      <RenderFormEditSubCategories
        subCategoryId={subCategoryId}
        subCategory={subCategory}
        allCategoriesOptions={allCategoriesOptions}
      />
    </main>
  );
};

export default EditSubCategoryPage;
