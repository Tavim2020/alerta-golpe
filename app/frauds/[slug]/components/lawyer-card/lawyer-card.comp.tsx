import Image from "next/image";
import { MessageCircle, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { RenderMarkdown } from "@/components/markdown/render-markdown";
import { generateWhatsAppLawyerLink } from "@/utils/generate/links";
import { ILawyerCardProps } from "./lawyer-card.type";
import { InstagramIcon } from "./components/instagram-icon";

export function LawyerCard({
  bio,
  instagram,
  name,
  phone,
  photo_url,
  specialty,
  fraudTitle,
  fraudSlug,
}: ILawyerCardProps) {
  return (
    <aside
      aria-label="Advogado responsável pela orientação jurídica"
      className="mt-8 overflow-hidden rounded-2xl border border-ink/10 bg-paper shadow-sm"
    >
      <div className="p-5 sm:p-7">
        <div className="flex items-center gap-2">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-sun">
            <ShieldCheck size={21} className="text-ink" />
          </div>

          <div>
            <p className="text-sm font-bold text-ink">Advogado parceiro</p>
            <p className="text-xs text-ink/60">Orientação jurídica</p>
          </div>
        </div>

        <div className="my-5 h-px bg-ink/10" />

        <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
          {photo_url && (
            <div className="size-24 shrink-0 overflow-hidden rounded-2xl border border-ink/10 bg-white sm:size-28">
              <Image
                src={photo_url}
                alt={`Foto de ${name || "advogado parceiro"}`}
                width={100}
                height={100}
                sizes="(max-width: 640px) 96px, 112px"
                className="min-w-24 min-h-24 object-cover sm:min-w-28 sm:min-h-28"
              />
            </div>
          )}

          <div className="min-w-0 flex-1">
            {name && (
              <h2 className="text-xl font-bold leading-tight tracking-tight text-ink sm:text-2xl">
                {name}
              </h2>
            )}

            {specialty && specialty.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {specialty.map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-ink/10 bg-white px-3 py-1.5 text-xs font-medium text-ink/80"
                  >
                    {item}
                  </span>
                ))}
              </div>
            )}

            {bio && <RenderMarkdown>{bio}</RenderMarkdown>}
          </div>
        </div>

        {(phone || instagram) && (
          <div className="mt-6 flex flex-wrap gap-3 border-t border-ink/10 pt-5">
            {phone && (
              <Link
                href={generateWhatsAppLawyerLink({
                  lawyerPhone: phone,
                  fraudTitle,
                  fraudSlug,
                })}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-ink px-4 py-2.5 text-sm font-semibold text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-alarm focus-visible:ring-offset-2"
              >
                <MessageCircle size={17} className="text-sun" />
                Entrar em contato
              </Link>
            )}

            {instagram && (
              <Link
                href={instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Instagram de ${name || "advogado parceiro"}`}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-ink/15 bg-white px-4 py-2.5 text-sm font-semibold text-ink transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-alarm focus-visible:ring-offset-2"
              >
                <InstagramIcon />
                Instagram
              </Link>
            )}
          </div>
        )}

        <p className="mt-5 border-t border-ink/10 pt-4 text-xs leading-5 text-ink/60">
          A associação deste profissional à publicação não representa garantia
          de resultado jurídico nem substitui uma consulta individual.
        </p>
      </div>
    </aside>
  );
}
