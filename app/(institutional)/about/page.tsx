import type { Metadata } from "next";
import { APP_ROUTE } from "@/routes/app.route";
import { InstitutionalPage } from "../shared/components/institutional-page";
import { aboutContent } from "./constants/about.constant";

export const metadata: Metadata = {
  title: "Sobre o Alerta Golpe",
  description:
    "Conheça o Alerta Golpe, uma plataforma colaborativa que compartilha informações sobre fraudes para ajudar pessoas a reconhecer golpes e evitar novas vítimas.",
  alternates: {
    canonical: APP_ROUTE.ABOUT.ROOT,
  },
};

export default function AboutPage() {
  return (
    <InstitutionalPage
      title="Sobre o Alerta Golpe"
      description="Conheça nossa missão e entenda como a informação compartilhada pode ajudar a prevenir novas fraudes."
      content={aboutContent}
    />
  );
}
