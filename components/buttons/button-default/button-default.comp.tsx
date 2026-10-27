import { cn } from "@/libs/utils";
import { IButtonDefaultProps } from "./button-default.type";
import { buttonVariants } from "../shared/constants/button.constant";

export const ButtonDefault = ({
  variant = "contain",
  className,
  onClick,
  type = "button",
  children,
  disabled,
  "aria-label": ariaLabel,
  role,
}: IButtonDefaultProps) => {
  const variantClassName = buttonVariants[variant];

  return (
    <button
      type={type}
      onClick={onClick}
      className={cn(variantClassName, className)}
      disabled={disabled}
      aria-label={ariaLabel}
      role={role}
    >
      {children}
    </button>
  );
};
