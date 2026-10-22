import { Control, FieldValues } from "react-hook-form";
import {
  IAutocompleteOption,
  IAutoCompleteProps,
} from "./components/autocomplete/autocomplete.type";

export interface IControlledAutocompleteProps<
  GProps extends FieldValues,
> extends Omit<IAutoCompleteProps<GProps>, "errors" | "field"> {
  control: Control<GProps>;
}
