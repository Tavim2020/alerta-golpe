import { Control, FieldValues, Path } from "react-hook-form";

export interface IControlledTextArea<GProps extends FieldValues> {
  wrapperClassName?: string;
  textAreaClassName?: string;
  name: Path<GProps>;
  control: Control<GProps>;
  rows?: number;
  placeholder: string;
  minLength?: number;
  maxLength?: number;
  disabled?: boolean;
  required?: boolean;
}
