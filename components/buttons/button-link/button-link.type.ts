import { ComponentProps } from "react";
import { IButtonProps } from "../shared/types/buttons.type";

export interface IButtonLinkProps extends IButtonProps {
  href: string;
  target?: ComponentProps<"a">["target"];
  rel?: "noopener noreferrer";
}
