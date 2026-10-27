import { TButtonVariants } from "../types/buttons.type";

const defaultClassName =
  "inline-flex items-center justify-center gap-2 text-nowrap cursor-pointer disabled:opacity-50";

export const buttonVariants: Record<TButtonVariants, string | undefined> = {
  contain: `${defaultClassName} bg-ink px-5 py-3 font-bold text-sun transition hover:bg-black`,
  outline: `${defaultClassName} border border-ink/20 px-5 py-3 font-bold text-ink transition hover:bg-ink/5`,
  clean: defaultClassName,
  underline: `${defaultClassName} text-sm font-semibold underline`,
};
