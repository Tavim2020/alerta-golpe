import Link from "next/link";
import { ISecurityInformationCardProps } from "./security-information-card.type";
import Image from "next/image";

export const SecurityInformationCard = ({
  imageUrl,
  title,
  children,
  href,
}: ISecurityInformationCardProps) => {
  return (
    <article className="flex flex-col gap-4 p-5 transition hover:bg-ink/2 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0 flex-1">
        <div className="flex flex-col items-center gap-4 sm:flex-row">
          {imageUrl && (
            <div className="w-50 h-50 rounded-lg overflow-hidden sm:w-25 sm:h-25 sm:rounded-sm">
              <Image
                src={imageUrl}
                alt={title}
                width={100}
                height={100}
                className="min-w-50 min-h-50 object-cover sm:min-w-25 sm:min-h-25"
              />
            </div>
          )}

          <h3 className="font-medium text-center sm:text-left">{title}</h3>
        </div>

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
