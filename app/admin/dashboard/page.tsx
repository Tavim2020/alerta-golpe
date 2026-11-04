import { APP_ROUTE } from "@/routes/app.route";
import { DashboardHeader } from "./components/dashboard-header";
import { DashboardManagerButton } from "./components/dashboard-manager-button";
import { SecurityEmptyCard } from "../shared/components/security-empty-card";
import { SecurityInformationCard } from "../shared/components/security-information-card";
import { getFrauds } from "@/libs/supabase/frauds/get-frauds";
import { ISearchParamsDefaultProps } from "@/types/global.type";
import { WrapperFraudsFormSearch } from "@/components/frauds/wrapper-frauds-form-search";
import { Pagination } from "@/components/pagination";

export const dynamic = "force-dynamic";

export default async function AdminDashboard({
  searchParams,
}: ISearchParamsDefaultProps) {
  const { page, search } = await searchParams;

  const pageNumber = Number(page);

  if (page && isNaN(pageNumber))
    throw new Error("Parâmetro de busca(page) inválido!");

  const currentPage = pageNumber || 1;

  const {
    success,
    data: frauds,
    totalPages,
  } = await getFrauds({ page: currentPage, limit: 10, search });

  if (!success) throw new Error("Tivemos problemas ao buscar os advogados.");

  return (
    <main className="mx-auto w-full max-w-7xl space-y-8 py-8">
      <DashboardHeader />

      <section className="grid gap-4 sm:grid-cols-2">
        <DashboardManagerButton
          href={APP_ROUTE.ADMIN.CATEGORIES.ROOT()}
          iconString="▤"
          title="categorias"
        />

        <DashboardManagerButton
          href={APP_ROUTE.ADMIN.SUB_CATEGORIES.ROOT()}
          iconString="⤷"
          title="sub categorias"
        />

        <DashboardManagerButton
          href={APP_ROUTE.ADMIN.LAWYERS.ROOT()}
          iconString="⚖"
          title="advogados"
          className="sm:col-span-2"
        />
      </section>

      <WrapperFraudsFormSearch page="dashboard" />

      <section className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-display text-2xl">Fraudes cadastradas</h2>
            <p className="mt-1 text-sm text-ink/60">
              Consulte os conteúdos registrados na plataforma.
            </p>
          </div>
        </div>

        {frauds.length === 0 && (
          <SecurityEmptyCard
            href={APP_ROUTE.ADMIN.FRAUD.CREATE}
            title="fraud"
          />
        )}

        {frauds.length > 0 && (
          <div className="divide-y divide-ink/10 border border-ink/15 bg-white">
            {frauds.map((fraud) => (
              <SecurityInformationCard
                key={fraud.slug}
                href={APP_ROUTE.ADMIN.FRAUD.EDIT(fraud.slug)}
                title={fraud.title}
              >
                {fraud.description && (
                  <p className="mt-1 line-clamp-2 text-sm text-ink/60">
                    {fraud.description}
                  </p>
                )}

                {fraud?.slug && (
                  <p className="text-xs text-gray-500">Slug: {fraud.slug}</p>
                )}
              </SecurityInformationCard>
            ))}
          </div>
        )}

        <Pagination
          basePath={(page) => APP_ROUTE.ADMIN.DASHBOARD.ROOT({ page, search })}
          totalPages={totalPages}
          currentPage={currentPage}
        />
      </section>
    </main>
  );
}
