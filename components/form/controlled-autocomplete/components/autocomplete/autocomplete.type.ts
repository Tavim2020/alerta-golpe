import {
  ControllerRenderProps,
  FieldErrors,
  FieldValues,
  Path,
} from "react-hook-form";

export interface IAutocompleteOption {
  value: string;
  label: string;
  photoUrl?: string;
}

export interface IAutoCompleteProps<GProps extends FieldValues> {
  name: Path<GProps>;
  options: IAutocompleteOption[];
  placeholder?: string;
  disabled?: boolean;
  multiple?: boolean;
  wrapperClassName?: string;
  inputClassName?: string;
  required?: boolean;
  label: string;
  field: ControllerRenderProps<GProps, Path<GProps>>;
  errors: FieldErrors<GProps>;
  onChange?: (option: IAutocompleteOption) => void;
}
