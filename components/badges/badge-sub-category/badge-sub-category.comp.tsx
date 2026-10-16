import { IBadgeSubCategoryProps } from "./badge-sub-category.type";

export const BadgeSubCategory = ({ children }: IBadgeSubCategoryProps) => {
  return (
    <span className="inline-flex items-center rounded-full bg-sun/30 px-2.5 py-1 text-xs font-semibold text-ink">
      {children}
    </span>
  );
};
