"use client";

import { useQuery } from "@tanstack/react-query";
import { API_ROUTE } from "@/routes/api.route";
import { APP_ROUTE } from "@/routes/app.route";
import { useSearchParams } from "next/navigation";
import {
  TFraudDashboard,
  TNextServerGetFrauds,
} from "@/app/api/admin/frauds/get/route.type";
import { DashboardHeader } from "./components/dashboard-header";
import { DashboardManagerButton } from "./components/dashboard-manager-button";
import { SecurityLoading } from "../shared/components/security-loading";
import { SecurityErrorCard } from "../shared/components/security-error-card";
import { SecurityEmptyCard } from "../shared/components/security-empty-card";
import { SecurityInformationCard } from "../shared/components/security-information-card";

async function getFrauds(objectWithParams: {
  page?: string | number;
  search?: string;
  limit?: string | number;
}): Promise<TFraudDashboard[]> {
  const response = await fetch(API_ROUTE.FRAUDS.GET(objectWithParams));

  if (!response.ok) throw new Error("Não foi possível carregar as fraudes.");

  const responseData = (await response.json()) as TNextServerGetFrauds;

  if (!responseData.success)
    throw new Error("Não foi possível carregar as fraudes.");

  return responseData.data;
}

export default function AdminDashboard() {
  const searchParams = useSearchParams();
  const page = searchParams.get("page") || "";
  const search = searchParams.get("search") || "";

  const {
    data: frauds = [],
    isPending,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["frauds"],
    queryFn: async () => getFrauds({ page, limit: 10, search }),
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
  });

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

      <section className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-display text-2xl">Fraudes cadastradas</h2>
            <p className="mt-1 text-sm text-ink/60">
              Consulte os conteúdos registrados na plataforma.
            </p>
          </div>
        </div>

        {isPending && <SecurityLoading />}

        {isError && <SecurityErrorCard refetch={refetch} />}

        {!isPending && !isError && frauds.length === 0 && (
          <SecurityEmptyCard
            href={APP_ROUTE.ADMIN.FRAUD.CREATE}
            title="fraud"
          />
        )}

        {!isPending && !isError && frauds.length > 0 && (
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
      </section>
    </main>
  );
}
