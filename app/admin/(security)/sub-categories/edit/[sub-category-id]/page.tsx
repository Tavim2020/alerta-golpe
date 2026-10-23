import { BackButton } from "@/app/admin/(security)/shared/components/back-button";
import { RenderFormEditSubCategories } from "./components/render-form-edit-sub-categories";
import { TSubCategoryIdPageProps } from "./page.type";
import { getSubCategoryById } from "./utils/get-sub-category-by-id";
import { APP_ROUTE } from "@/routes/app.route";
import { getCategoriesOptions } from "@/libs/supabase/categories/get-categories";

const EditSubCategoryPage = async ({ params }: TSubCategoryIdPageProps) => {
  const { "sub-category-id": subCategoryId } = await params;

  const [
    { success: successGetSubCategory, data: subCategoriesData },
    { success: successCategoryOptions, data: allCategoriesOptions },
  ] = await Promise.all([
    getSubCategoryById(subCategoryId),
    getCategoriesOptions(),
  ]);

  if (!successGetSubCategory || !successCategoryOptions)
    throw new Error("Tivemos problemas ao buscar as informações");

  return (
    <main className="mx-auto w-full max-w-7xl space-y-8 py-8">
      <BackButton
        title="Edição de Sub Categoria"
        href={APP_ROUTE.ADMIN.SUB_CATEGORIES.ROOT()}
      />

      <RenderFormEditSubCategories
        subCategoryId={subCategoryId}
        subCategory={subCategoriesData}
        allCategoriesOptions={allCategoriesOptions}
      />
    </main>
  );
};

export default EditSubCategoryPage;
