import { Control, FieldValues, Path } from "react-hook-form";

export interface IControlledFile<GProps extends FieldValues> {
  wrapperClassName?: string;
  inputClassName?: string;
  name: Path<GProps>;
  control: Control<GProps>;
  accept: string;
  placeholder: string;
  disabled?: boolean;
  required?: boolean;
}
