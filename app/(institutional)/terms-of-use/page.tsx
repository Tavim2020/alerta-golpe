import type { Metadata } from "next";
import { APP_ROUTE } from "@/routes/app.route";
import { InstitutionalPage } from "../shared/components/institutional-page";
import { termsOfUseContent } from "./constants/terms-of-use.constant";

export const metadata: Metadata = {
  title: "Termos de Uso",
  description:
    "Consulte os Termos de Uso do Alerta Golpe e conheça as condições para utilização da plataforma e envio de relatos.",
  alternates: {
    canonical: APP_ROUTE.TERMS_OF_USE.ROOT,
  },
};

export default function TermsPage() {
  return (
    <InstitutionalPage
      title="Termos de Uso"
      description="Conheça as condições para utilizar o Alerta Golpe, enviar relatos e consultar os conteúdos publicados na plataforma."
      content={termsOfUseContent}
    />
  );
}
