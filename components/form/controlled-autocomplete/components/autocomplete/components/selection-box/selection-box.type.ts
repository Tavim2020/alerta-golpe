import { ControllerRenderProps, FieldValues, Path } from "react-hook-form";
import { IAutocompleteOption } from "../../autocomplete.type";

export interface ISelectionBoxProps<
  GProps extends FieldValues,
> extends IAutocompleteOption {
  disabled?: boolean;
  field: ControllerRenderProps<GProps, Path<GProps>>;
  selectedValues: string[];
}
