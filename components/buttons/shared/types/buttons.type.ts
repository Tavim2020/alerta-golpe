import { ReactNode } from "react";

export type TButtonVariants = "contain" | "outline" | "clean" | "underline";

export interface IButtonProps {
  variant?: TButtonVariants;
  className?: string;
  children: ReactNode;
}
