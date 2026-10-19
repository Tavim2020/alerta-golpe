import { ComponentProps } from "react";
import { Control, FieldValues, Path } from "react-hook-form";

export interface IControlledInputText<GProps extends FieldValues> {
  wrapperClassName?: string;
  inputClassName?: string;
  name: Path<GProps>;
  control: Control<GProps>;
  type?: "text" | "password";
  formatOnValue?: (value: string) => string;
  formatOnChange?: (value: string) => string;
  placeholder: string;
  minLength?: number;
  maxLength?: number;
  disabled?: boolean;
  required?: boolean;
}
