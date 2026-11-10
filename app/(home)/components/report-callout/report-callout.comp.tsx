import { ButtonLink } from "@/components/buttons/button-link";
import { generateContactAlertaGolpeLink } from "@/utils/generate/links";
import { ShieldAlert, MessageSquareText, ArrowRight } from "lucide-react";

export function ReportCallout() {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden rounded-2xl border border-primary/10 bg-primary/[0.04] px-6 py-10 sm:px-10">
        <div className="relative z-10 max-w-2xl">
          <div className="mb-5 flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <ShieldAlert size={26} />
          </div>

          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Você sofreu um golpe?
            <span className="block text-primary">
              Sua experiência pode ajudar outras pessoas.
            </span>
          </h2>

          <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            Compartilhe seu relato com o Alerta Golpe. Nossa equipe organiza as
            informações para que outras pessoas possam reconhecer a fraude e
            evitar cair nela.
          </p>

          <div className="mt-7">
            <ButtonLink
              href={generateContactAlertaGolpeLink()}
              variant="clean"
              target="_blank"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              <MessageSquareText size={18} />
              Compartilhar meu relato
              <ArrowRight size={18} />
            </ButtonLink>
          </div>
        </div>

        <div className="pointer-events-none absolute -right-12 -bottom-20 opacity-[0.06]">
          <ShieldAlert size={280} strokeWidth={1} />
        </div>
      </div>
    </section>
  );
}
