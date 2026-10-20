"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { API_ROUTE } from "@/routes/api.route";
import { APP_ROUTE } from "@/routes/app.route";

type Fraud = {
  id: string;
  title: string;
  description?: string;
};

async function getFrauds(): Promise<Fraud[]> {
  const response = await fetch(API_ROUTE.FRAUDS);

  if (!response.ok) {
    throw new Error("Não foi possível carregar as fraudes.");
  }

  return response.json();
}

export default function AdminDashboard() {
  const {
    data: frauds = [],
    isPending,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["frauds"],
    queryFn: getFrauds,
  });

  return (
    <main className="mx-auto w-full max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      {/* Cabeçalho */}
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-ink/60">Administração</p>
          <h1 className="mt-1 font-display text-3xl">Dashboard</h1>
          <p className="mt-2 text-sm text-ink/70">
            Gerencie as fraudes e os cadastros da plataforma.
          </p>
        </div>

        <Link
          href={APP_ROUTE.ADMIN.FRAUD.CREATE}
          className="inline-flex items-center justify-center bg-sun px-5 py-3 font-medium text-black transition hover:brightness-95"
        >
          + Cadastrar fraude
        </Link>
      </header>

      {/* Ações administrativas */}
      <section className="grid gap-4 sm:grid-cols-2">
        <Link
          href={APP_ROUTE.ADMIN.CATEGORIES.ROOT}
          className="group flex items-center gap-4 border border-ink/15 bg-white p-5 transition hover:border-ink/40"
        >
          <div className="flex size-12 shrink-0 items-center justify-center bg-sun/30 text-xl">
            <span aria-hidden="true">▤</span>
          </div>

          <div className="min-w-0 flex-1">
            <h2 className="font-display text-xl">Categorias</h2>
            <p className="mt-1 text-sm text-ink/60">
              Visualizar categorias e subcategorias.
            </p>
          </div>

          <span className="text-xl transition-transform group-hover:translate-x-1">
            →
          </span>
        </Link>

        <Link
          href={APP_ROUTE.ADMIN.LAWYERS.ROOT}
          className="group flex items-center gap-4 border border-ink/15 bg-white p-5 transition hover:border-ink/40"
        >
          <div className="flex size-12 shrink-0 items-center justify-center bg-sun/30 text-xl">
            <span aria-hidden="true">⚖</span>
          </div>

          <div className="min-w-0 flex-1">
            <h2 className="font-display text-xl">Advogados</h2>
            <p className="mt-1 text-sm text-ink/60">
              Cadastrar e gerenciar advogados.
            </p>
          </div>

          <span className="text-xl transition-transform group-hover:translate-x-1">
            →
          </span>
        </Link>
      </section>

      {/* Listagem de fraudes */}
      <section className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-display text-2xl">Fraudes cadastradas</h2>
            <p className="mt-1 text-sm text-ink/60">
              Consulte os conteúdos registrados na plataforma.
            </p>
          </div>

          {!isPending && !isError && (
            <span className="text-sm text-ink/60">
              {frauds.length} {frauds.length === 1 ? "fraude" : "fraudes"}
            </span>
          )}
        </div>

        {isPending && (
          <div className="border border-ink/15 bg-white p-8 text-center">
            <p className="text-sm text-ink/60">Carregando fraudes...</p>
          </div>
        )}

        {isError && (
          <div className="space-y-3 border border-red-200 bg-white p-6">
            <p className="text-sm text-red-600">
              Não foi possível carregar a listagem.
            </p>

            <button
              type="button"
              onClick={() => refetch()}
              className="border border-ink/20 px-4 py-2 text-sm transition hover:bg-ink/5"
            >
              Tentar novamente
            </button>
          </div>
        )}

        {!isPending && !isError && frauds.length === 0 && (
          <div className="border border-dashed border-ink/25 bg-white p-10 text-center">
            <h3 className="font-display text-xl">Nenhuma fraude cadastrada</h3>
            <p className="mt-2 text-sm text-ink/60">
              Comece adicionando o primeiro conteúdo.
            </p>

            <Link
              href={APP_ROUTE.ADMIN.FRAUD.CREATE}
              className="mt-5 inline-flex bg-sun px-5 py-3 font-medium text-black hover:brightness-95"
            >
              Cadastrar primeira fraude
            </Link>
          </div>
        )}

        {!isPending && !isError && frauds.length > 0 && (
          <div className="divide-y divide-ink/10 border border-ink/15 bg-white">
            {frauds.map((fraud) => (
              <article
                key={fraud.id}
                className="flex flex-col gap-4 p-5 transition hover:bg-ink/[0.02] sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0 flex-1">
                  <h3 className="font-medium">{fraud.title}</h3>

                  {fraud.description && (
                    <p className="mt-1 line-clamp-2 text-sm text-ink/60">
                      {fraud.description}
                    </p>
                  )}

                  <p className="mt-2 text-xs text-ink/50">ID: {fraud.id}</p>
                </div>

                <Link
                  href={APP_ROUTE.ADMIN.FRAUD.EDIT(fraud.id)}
                  className="inline-flex shrink-0 items-center justify-center border border-ink/20 px-4 py-2 text-sm transition hover:bg-ink/5"
                >
                  Visualizar / editar →
                </Link>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
