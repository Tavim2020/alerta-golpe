"use client";

import { cn } from "@/libs/utils";
import { IAutocompleteOptionProps } from "./autocomplete-option.type";
import { ButtonDefault } from "@/components/buttons/button-default";

export const AutocompleteOption = ({
  option,
  selectOption,
  selectedValues,
}: IAutocompleteOptionProps) => {
  const selected = selectedValues.includes(option.value);

  return (
    <li key={option.value}>
      <ButtonDefault
        variant="clean"
        role="option"
        aria-selected={selected}
        onClick={() => selectOption(option)}
        className={cn(
          "w-full py-2 text-left text-sm hover:bg-ink/5 justify-start",
          selected && "px-3 bg-sun/20 font-medium",
        )}
      >
        <span className="mr-2">{selected ? "✓" : ""}</span>
        {option.label}
      </ButtonDefault>
    </li>
  );
};
