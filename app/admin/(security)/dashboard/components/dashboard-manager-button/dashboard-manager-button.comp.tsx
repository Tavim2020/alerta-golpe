import Link from "next/link";
import { IDashboardManagerButtonProps } from "./dashboard-manager-button.type";

export const DashboardManagerButton = ({
  href,
  iconString,
  title,
}: IDashboardManagerButtonProps) => {
  return (
    <Link
      href={href}
      className="group flex items-center gap-4 border border-ink/15 bg-white p-5 transition hover:border-ink/40"
    >
      <div className="flex size-12 shrink-0 items-center justify-center bg-sun/30 text-xl">
        <span aria-hidden="true">{iconString}</span>
      </div>

      <div className="min-w-0 flex-1">
        <h2 className="font-display text-xl capitalize">{title}</h2>
        <p className="mt-1 text-sm text-ink/60">
          Cadastrar e gerenciar {title}.
        </p>
      </div>

      <span className="text-xl transition-transform group-hover:translate-x-1">
        →
      </span>
    </Link>
  );
};
