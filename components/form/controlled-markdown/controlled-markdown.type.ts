import { Control, FieldValues, Path } from "react-hook-form";

export interface IControlledMarkdown<GProps extends FieldValues> {
  wrapperClassName?: string;
  markdownClassName?: string;
  name: Path<GProps>;
  control: Control<GProps>;
  placeholder: string;
  minLength?: number;
  maxLength?: number;
  disabled?: boolean;
  required?: boolean;
}
