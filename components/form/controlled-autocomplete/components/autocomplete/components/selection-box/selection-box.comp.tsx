"use client";

import { ButtonDefault } from "@/components/buttons/button-default";
import { ISelectionBoxProps } from "./selection-box.type";
import { FieldValues } from "react-hook-form";

export const SelectionBox = <GProps extends FieldValues>({
  value,
  label,
  disabled,
  field,
  selectedValues,
}: ISelectionBoxProps<GProps>) => {
  return (
    <span className="inline-flex items-center gap-2 bg-sun/30 px-2 py-1 text-sm">
      {label}

      <ButtonDefault
        variant="clean"
        disabled={disabled}
        aria-label={`Remover ${label}`}
        onClick={() =>
          field.onChange(
            selectedValues.filter((selectedValue) => selectedValue !== value),
          )
        }
        className="font-bold"
      >
        ×
      </ButtonDefault>
    </span>
  );
};
