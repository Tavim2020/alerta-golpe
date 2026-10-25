import Link from "next/link";
import { ISecurityEmptyCardProps } from "./security-empty-card.type";

export const SecurityEmptyCard = ({ title, href }: ISecurityEmptyCardProps) => {
  return (
    <div className="border border-dashed border-ink/25 bg-white p-10 text-center">
      <h3 className="font-display text-xl">Nenhuma {title} cadastrada</h3>
      <p className="mt-2 text-sm text-ink/60">
        Comece adicionando o primeiro conteúdo.
      </p>

      <Link
        href={href}
        className="mt-5 inline-flex bg-sun px-5 py-3 font-medium text-black hover:brightness-95"
      >
        Cadastrar primeira {title}
      </Link>
    </div>
  );
};
