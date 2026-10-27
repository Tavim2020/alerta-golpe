"use client";

import { cn } from "@/libs/utils";
import { IAutocompleteOptionProps } from "./autocomplete-option.type";
import { ButtonDefault } from "@/components/buttons/button-default";
import Image from "next/image";

export const AutocompleteOption = ({
  option,
  selectOption,
  selectedValues,
}: IAutocompleteOptionProps) => {
  const selected = selectedValues.includes(option.value);

  return (
    <li>
      <ButtonDefault
        variant="clean"
        role="option"
        aria-selected={selected}
        onClick={() => selectOption(option)}
        className={cn(
          "w-full pl-2 py-2 text-left text-sm hover:bg-ink/5 justify-start",
          selected && "px-3 bg-sun/20 font-medium",
        )}
      >
        {option.photoUrl && (
          <div className="w-20 h-20 rounded-lg overflow-hidden sm:w-10 sm:h-10 sm:rounded-sm">
            <Image
              src={option.photoUrl}
              alt={option.label}
              width={100}
              height={100}
              className="min-w-20 min-h-20 object-cover sm:min-w-10 sm:min-h-10"
            />
          </div>
        )}

        <span className="mr-2">{selected ? "✓" : ""}</span>
        {option.label}
      </ButtonDefault>
    </li>
  );
};
