"use client";

import Link from "next/link";
import { AlertCircle, ArrowLeft, Home, Search } from "lucide-react";

import { APP_ROUTE } from "@/routes/app.route";
import { useRouter } from "next/navigation";

export default function NotFoundPage() {
  const router = useRouter();

  return (
    <main className="flex min-h-[70vh] items-center justify-center px-4 py-16">
      <div className="w-full max-w-lg text-center">
        <div className="mx-auto mb-6 grid size-20 place-items-center rounded-full bg-sun/20">
          <Search className="size-10 text-ink" aria-hidden="true" />
        </div>

        <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-ink/60">
          Erro 404
        </p>

        <h1 className="font-display text-3xl font-bold leading-tight sm:text-4xl">
          Ops! Não encontramos esta página.
        </h1>

        <p className="mx-auto mt-4 max-w-md leading-relaxed text-ink/70">
          O conteúdo que você procura pode ter sido removido, estar indisponível
          ou o endereço pode estar incorreto.
        </p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href={APP_ROUTE.HOME.ROOT}
            className="inline-flex items-center justify-center gap-2 bg-ink px-5 py-3 font-bold text-sun transition hover:bg-black"
          >
            <Home className="size-4" aria-hidden="true" />
            Ir para o início
          </Link>

          <Link
            href={APP_ROUTE.FRAUDS.ROOT}
            className="inline-flex items-center justify-center gap-2 border border-ink/20 px-5 py-3 font-bold text-ink transition hover:bg-ink/5"
          >
            <AlertCircle className="size-4" aria-hidden="true" />
            Explorar golpes
          </Link>
        </div>

        <button
          type="button"
          onClick={() => router.back()}
          className="mt-6 inline-flex items-center gap-2 text-sm text-ink/60 underline underline-offset-4 transition hover:text-ink"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Voltar à página anterior
        </button>
      </div>
    </main>
  );
}
