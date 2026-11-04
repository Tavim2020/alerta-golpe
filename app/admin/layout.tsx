import { ButtonLink } from "@/components/buttons/button-link";
import { API_ROUTE } from "@/routes/api.route";
import { APP_ROUTE } from "@/routes/app.route";
import { RootLayoutProps } from "@/types/global.type";

const SecurityLayout = ({ children }: RootLayoutProps) => {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex items-center justify-between">
        <ButtonLink variant="clean" href={APP_ROUTE.ADMIN.DASHBOARD.ROOT()}>
          <h1 className="font-display text-4xl">Painel Administrativo</h1>
        </ButtonLink>

        <ButtonLink
          variant="underline"
          href={API_ROUTE.LOG_OUT}
          className="text-sm font-semibold underline"
          prefetch={false}
        >
          Sair
        </ButtonLink>
      </div>

      {children}
    </div>
  );
};

export default SecurityLayout;
