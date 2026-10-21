import { IAutocompleteOption } from "../../autocomplete.type";

export interface IAutocompleteOptionProps {
  option: IAutocompleteOption;
  selectOption: (option: IAutocompleteOption) => void;
  selectedValues: string[];
}
