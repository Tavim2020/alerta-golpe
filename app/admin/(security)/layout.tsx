import { ButtonLink } from "@/components/buttons/button-link";
import { API_ROUTE } from "@/routes/api.route";
import { RootLayoutProps } from "@/types/global.type";

const SecurityLayout = ({ children }: RootLayoutProps) => {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-4xl">Painel Administrativo</h1>

        <ButtonLink
          variant="underline"
          href={API_ROUTE.ADMIN_LOG_OUT}
          className="text-sm font-semibold underline"
        >
          Sair
        </ButtonLink>
      </div>

      {children}
    </div>
  );
};

export default SecurityLayout;
