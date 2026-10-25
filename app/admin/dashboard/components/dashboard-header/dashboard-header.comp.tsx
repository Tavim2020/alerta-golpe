import { ButtonLink } from "@/components/buttons/button-link";
import { APP_ROUTE } from "@/routes/app.route";

export const DashboardHeader = () => {
  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-sm font-medium text-ink/60">Administração</p>
        <h1 className="mt-1 font-display text-3xl">Dashboard</h1>
        <p className="mt-2 text-sm text-ink/70">
          Gerencie as fraudes e os cadastros da plataforma.
        </p>
      </div>

      <ButtonLink
        href={APP_ROUTE.ADMIN.FRAUD.CREATE}
        className="bg-sun px-5 py-3 font-medium text-black transition hover:bg-sun hover:text-black hover:brightness-95"
      >
        + Cadastrar fraude
      </ButtonLink>
    </header>
  );
};
