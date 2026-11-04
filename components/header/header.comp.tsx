import { APP_INFO } from "@/constants/app.constant";
import { APP_ROUTE } from "@/routes/app.route";
import { ButtonLink } from "../buttons/button-link";

export const Header = () => {
  return (
    <header className="bg-ink text-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <ButtonLink
          href={APP_ROUTE.HOME.ROOT}
          variant="clean"
          className="font-display text-2xl text-sun"
        >
          {APP_INFO.name}
        </ButtonLink>

        <nav className="flex gap-5 text-sm font-semibold">
          <ButtonLink
            href={APP_ROUTE.HOME.ROOT}
            variant="clean"
            className="hover:text-sun"
          >
            Início
          </ButtonLink>

          <ButtonLink
            href={APP_ROUTE.FRAUDS.ROOT()}
            variant="clean"
            className="hover:text-sun"
          >
            Golpes sofridos
          </ButtonLink>
        </nav>
      </div>
    </header>
  );
};
