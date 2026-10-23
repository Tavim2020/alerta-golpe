import { getAllCategories } from "@/libs/supabase/categories/get-categories";
import { BackButton } from "../shared/components/back-button";
import { SecurityEmptyCard } from "../shared/components/security-empty-card";
import { SecurityInformationCard } from "../shared/components/security-information-card";
import { APP_ROUTE } from "@/routes/app.route";
import { ICategoriesPageProps } from "./page.type";
import { Pagination } from "@/components/pagination";
import { WrapperCategoriesFormSearch } from "./components/wrapper-categories-form-search";
import { ButtonLink } from "@/components/buttons/button-link";

export const dynamic = "force-dynamic";

const CategoriesPage = async ({ searchParams }: ICategoriesPageProps) => {
  const { page, search } = await searchParams;

  const pageNumber = Number(page);

  if (page && isNaN(pageNumber))
    throw new Error("Parâmetro de busca(page) inválido!");

  const currentPage = pageNumber || 1;

  const { success, data, totalPages } = await getAllCategories({
    page: currentPage,
    limit: 10,
    search,
  });

  if (!success) throw new Error("Tivemos problemas ao buscar as categorias.");

  return (
    <main className="mx-auto w-full max-w-7xl space-y-8 py-8">
      <div className="flex items-center justify-between">
        <BackButton title="Categorias" href={APP_ROUTE.ADMIN.DASHBOARD.ROOT} />

        <ButtonLink
          href={APP_ROUTE.ADMIN.CATEGORIES.CREATE}
          className="bg-sun px-5 py-3 font-medium text-black transition hover:bg-sun hover:text-black hover:brightness-95"
        >
          Cadastrar Categoria
        </ButtonLink>
      </div>

      <WrapperCategoriesFormSearch />

      {data.length === 0 && (
        <SecurityEmptyCard
          href={APP_ROUTE.ADMIN.CATEGORIES.CREATE}
          title="categoria"
        />
      )}

      {data.length > 0 && (
        <div className="divide-y divide-ink/10 border border-ink/15 bg-white">
          {data.map((category) => (
            <SecurityInformationCard
              key={category.id}
              href={APP_ROUTE.ADMIN.CATEGORIES.EDIT(category.id)}
              title={category.name}
            />
          ))}
        </div>
      )}

      <Pagination
        basePath={(page) => APP_ROUTE.ADMIN.CATEGORIES.ROOT({ page, search })}
        totalPages={totalPages}
        currentPage={currentPage}
      />
    </main>
  );
};

export default CategoriesPage;
