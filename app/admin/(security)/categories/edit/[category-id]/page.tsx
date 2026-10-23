import { BackButton } from "@/app/admin/(security)/shared/components/back-button";
import { RenderFormCategories } from "./components/render-form-categories";
import { TCategoryIdPageProps } from "./page.type";
import { getCategoryById } from "./utils/get-category-by-id";
import { APP_ROUTE } from "@/routes/app.route";

const EditCategoryPage = async ({ params }: TCategoryIdPageProps) => {
  const { "category-id": categoryId } = await params;

  const { success, data } = await getCategoryById(categoryId);

  if (!success) throw new Error("Tivemos problemas ao buscar a categoria");

  return (
    <main className="mx-auto w-full max-w-7xl space-y-8 py-8">
      <BackButton
        title="Edição de Categoria"
        href={APP_ROUTE.ADMIN.CATEGORIES.ROOT()}
      />

      <RenderFormCategories categoryId={categoryId} category={data} />
    </main>
  );
};

export default EditCategoryPage;
