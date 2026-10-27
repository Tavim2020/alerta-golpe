import { BackButton } from "../shared/components/back-button";
import { SecurityEmptyCard } from "../shared/components/security-empty-card";
import { SecurityInformationCard } from "../shared/components/security-information-card";
import { APP_ROUTE } from "@/routes/app.route";
import { Pagination } from "@/components/pagination";
import { WrapperLawyersFormSearch } from "./components/wrapper-lawyers-form-search";
import { ButtonLink } from "@/components/buttons/button-link";
import { ISearchParamsDefaultProps } from "@/types/global.type";
import { getAllLayers } from "@/libs/supabase/lawyers/get-lawyers";
import { RenderMarkdown } from "@/components/markdown/render-markdown";

export const dynamic = "force-dynamic";

const LawyersPage = async ({ searchParams }: ISearchParamsDefaultProps) => {
  const { page, search } = await searchParams;

  const pageNumber = Number(page);

  if (page && isNaN(pageNumber))
    throw new Error("Parâmetro de busca(page) inválido!");

  const currentPage = pageNumber || 1;

  const { success, data, totalPages } = await getAllLayers({
    page: currentPage,
    limit: 10,
    search,
  });

  if (!success) throw new Error("Tivemos problemas ao buscar os advogados.");

  return (
    <main className="mx-auto w-full max-w-7xl space-y-8 py-8">
      <div className="flex flex-col justify-between gap-4 sm:items-center sm:flex-row">
        <BackButton title="Advogados" href={APP_ROUTE.ADMIN.DASHBOARD.ROOT()} />

        <ButtonLink
          href={APP_ROUTE.ADMIN.LAWYERS.CREATE}
          className="bg-sun px-5 py-3 font-medium text-black transition hover:bg-sun hover:text-black hover:brightness-95"
        >
          Cadastrar Advogado
        </ButtonLink>
      </div>

      <WrapperLawyersFormSearch />

      {data.length === 0 && (
        <SecurityEmptyCard
          href={APP_ROUTE.ADMIN.LAWYERS.CREATE}
          title="advogado"
        />
      )}

      {data.length > 0 && (
        <div className="divide-y divide-ink/10 border border-ink/15 bg-white">
          {data.map((lawyer) => (
            <SecurityInformationCard
              key={lawyer.id}
              imageUrl={lawyer.photo_url}
              href={APP_ROUTE.ADMIN.LAWYERS.EDIT(lawyer.id)}
              title={lawyer.name}
            >
              <RenderMarkdown className="line-clamp-3">
                {lawyer.bio}
              </RenderMarkdown>
            </SecurityInformationCard>
          ))}
        </div>
      )}

      <Pagination
        basePath={(page) => APP_ROUTE.ADMIN.LAWYERS.ROOT({ page, search })}
        totalPages={totalPages}
        currentPage={currentPage}
      />
    </main>
  );
};

export default LawyersPage;
