import { ReactNode } from "react";
import {
  ControllerRenderProps,
  FieldErrors,
  FieldValues,
  Path,
} from "react-hook-form";

export interface IInputFileProps<GProps extends FieldValues> {
  wrapperClassName?: string;
  inputClassName?: string;
  name: Path<GProps>;
  accept: string;
  label?: ReactNode;
  disabled?: boolean;
  required?: boolean;
  field: ControllerRenderProps<GProps, Path<GProps>>;
  errors: FieldErrors<GProps>;
}
