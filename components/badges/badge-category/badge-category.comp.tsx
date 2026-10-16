import { IBadgeCategoryProps } from "./badge-category.type";

export const BadgeCategory = ({ children }: IBadgeCategoryProps) => {
  return (
    <span className="inline-flex items-center rounded-full bg-ink/10 px-2.5 py-1 text-xs font-semibold text-ink">
      {children}
    </span>
  );
};
