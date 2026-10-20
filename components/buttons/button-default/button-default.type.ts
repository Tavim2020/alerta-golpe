import { ComponentProps, MouseEventHandler, ReactNode } from "react";
import { IButtonProps } from "../shared/types/buttons.type";

export interface IButtonDefaultProps extends IButtonProps {
  type?: ComponentProps<"button">["type"];
  onClick?: MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
}
