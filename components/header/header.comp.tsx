import { APP_INFO } from "@/constants/app.constant";
import { APP_ROUTE } from "@/routes/app.route";
import Link from "next/link";

export const Header = () => {
  return (
    <header className="bg-ink text-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link
          href={APP_ROUTE.HOME.ROOT}
          className="font-display text-2xl text-sun"
        >
          {APP_INFO.name}
        </Link>

        <nav className="flex gap-5 text-sm font-semibold">
          <Link href={APP_ROUTE.HOME.ROOT} className="hover:text-sun">
            Início
          </Link>

          <Link href={APP_ROUTE.FRAUDS.ROOT()} className="hover:text-sun">
            Golpes sofridos
          </Link>
        </nav>
      </div>
    </header>
  );
};
