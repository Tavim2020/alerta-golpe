import { cn } from "@/libs/utils";
import { IButtonLinkProps } from "./button-link.type";
import Link from "next/link";
import { buttonVariants } from "../shared/constants/button.constant";

export const ButtonLink = ({
  variant = "contain",
  className,
  children,
  href,
  target,
  rel,
}: IButtonLinkProps) => {
  const variantClassName = buttonVariants[variant];

  return (
    <Link
      href={href}
      target={target}
      className={cn(
        "inline-flex items-center justify-center gap-2 text-nowrap cursor-pointer",
        variantClassName,
        className,
      )}
      rel={rel}
    >
      {children}
    </Link>
  );
};
