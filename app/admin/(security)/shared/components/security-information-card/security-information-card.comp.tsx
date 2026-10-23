import Link from "next/link";
import { ISecurityInformationCardProps } from "./security-information-card.type";

export const SecurityInformationCard = ({
  title,
  children,
  href,
}: ISecurityInformationCardProps) => {
  return (
    <article className="flex flex-col gap-4 p-5 transition hover:bg-ink/2 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0 flex-1">
        <h3 className="font-medium">{title}</h3>

        {children}
      </div>

      <Link
        href={href}
        className="inline-flex shrink-0 items-center justify-center border border-ink/20 px-4 py-2 text-sm transition hover:bg-ink/5"
      >
        Visualizar / editar →
      </Link>
    </article>
  );
};
