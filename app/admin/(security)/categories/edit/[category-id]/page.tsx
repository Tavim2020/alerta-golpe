import { BackButton } from "@/app/admin/(security)/shared/components/back-button";
import { RenderFormCategories } from "./components/render-form-categories";
import { APP_ROUTE } from "@/routes/app.route";
import { getCategoryById } from "@/libs/supabase/categories/get-categories";
import { IPageParamsProps } from "@/types/global.type";

const EditCategoryPage = async ({
  params,
}: IPageParamsProps<{ "category-id"?: string }>) => {
  const { "category-id": categoryId } = await params;

  if (!categoryId) throw new Error("Parâmetro não encontrado!");

  const { category } = await getCategoryById(categoryId);

  return (
    <main className="mx-auto w-full max-w-7xl space-y-8 py-8">
      <BackButton
        title="Edição de Categoria"
        href={APP_ROUTE.ADMIN.CATEGORIES.ROOT()}
      />

      <RenderFormCategories categoryId={categoryId} category={category} />
    </main>
  );
};

export default EditCategoryPage;
