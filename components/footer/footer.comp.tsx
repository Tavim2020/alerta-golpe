import { APP_INFO } from "@/constants/app.constant";
import { generateCurrentYear } from "@/utils/generate/dates";
import { ButtonLink } from "../buttons/button-link";
import { APP_ROUTE } from "@/routes/app.route";
import Image from "next/image";

export const Footer = () => {
  return (
    <footer className="mt-auto bg-ink px-4 py-8 text-white/70">
      <div className="mx-auto flex flex-col gap-8 max-w-6xl px-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
          <Image
            src="/logo/logo.png"
            alt={APP_INFO.name}
            width={100}
            height={100}
            className="mx-auto lg:mx-0 lg:w-20 lg:h-20"
            priority
          />

          <div className="flex flex-col gap-4 lg:ml-12">
            <ButtonLink
              href={APP_ROUTE.ABOUT.ROOT}
              variant="underline"
              className="lg:justify-start"
            >
              Sobre
            </ButtonLink>

            <ButtonLink
              href={APP_ROUTE.TERMS_OF_USE.ROOT}
              variant="underline"
              className="lg:justify-start"
            >
              Termos de uso
            </ButtonLink>

            <ButtonLink
              href={APP_ROUTE.PRIVACY_POLICY.ROOT}
              variant="underline"
              className="lg:justify-start"
            >
              Politica de privacidade
            </ButtonLink>
          </div>
        </div>

        <div className="text-center text-sm">
          <p>
            Os relatos são de pessoas reais. Foi vítima de golpe? Registre um
            boletim de ocorrência.
          </p>
          <p className="mt-1">
            © {generateCurrentYear()} {APP_INFO.name}
          </p>
        </div>
      </div>
    </footer>
  );
};
