import { ReactNode } from "react";

export type TButtonVariants = "contain" | "outline" | "clear" | "underline";

export interface IButtonProps {
  variant?: TButtonVariants;
  className?: string;
  children: ReactNode;
}
