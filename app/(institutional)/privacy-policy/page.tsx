import type { Metadata } from "next";
import { APP_ROUTE } from "@/routes/app.route";
import { privacyPolicyContent } from "./constants/privacy-policy.constant";
import { InstitutionalPage } from "../shared/components/institutional-page";

export const metadata: Metadata = {
  title: "Política de Privacidade",
  description:
    "Saiba como o Alerta Golpe trata informações pessoais, recebe relatos, utiliza cookies e protege a privacidade dos visitantes.",
  alternates: {
    canonical: APP_ROUTE.PRIVACY_POLICY.ROOT,
  },
};

export default function PrivacyPolicyPage() {
  return (
    <InstitutionalPage
      title="Política de Privacidade"
      description="Entenda como o Alerta Golpe trata informações pessoais, utiliza cookies e protege a privacidade dos visitantes e colaboradores."
      content={privacyPolicyContent}
    />
  );
}
