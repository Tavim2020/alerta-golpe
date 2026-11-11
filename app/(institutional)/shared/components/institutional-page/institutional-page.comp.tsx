import { APP_ROUTE } from "@/routes/app.route";
import { ButtonLink } from "@/components/buttons/button-link";
import { RenderMarkdown } from "@/components/markdown/render-markdown";
import { IInstitutionalPageProps } from "./institutional-page.type";

export function InstitutionalPage({
  title,
  description,
  content,
}: IInstitutionalPageProps) {
  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <ButtonLink variant="underline" href={APP_ROUTE.HOME.ROOT}>
        Voltar para home
      </ButtonLink>

      <header className="mb-8 mt-6">
        <h1 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
          {title}
        </h1>

        <p className="mt-3 text-base leading-7 text-ink/70 sm:text-lg sm:leading-8">
          {description}
        </p>
      </header>

      <section className="border-t border-ink/15 py-6">
        <RenderMarkdown>{content}</RenderMarkdown>
      </section>
    </main>
  );
}
