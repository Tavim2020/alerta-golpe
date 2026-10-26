"use client";

import { ButtonDefault } from "@/components/buttons/button-default";
import { ISelectionBoxProps } from "./selection-box.type";
import { FieldValues } from "react-hook-form";
import Image from "next/image";

export const SelectionBox = <GProps extends FieldValues>({
  value,
  label,
  disabled,
  field,
  selectedValues,
  photoUrl,
}: ISelectionBoxProps<GProps>) => {
  return (
    <span className="inline-flex items-center gap-2 bg-sun/30 px-2 py-1 text-sm">
      {photoUrl && (
        <div className="w-25 h-25 rounded-lg overflow-hidden sm:w-15 sm:h-15 sm:rounded-sm">
          <Image
            src={photoUrl}
            alt={value}
            width={100}
            height={100}
            className="min-w-25 min-h-25 object-cover sm:min-w-15 sm:min-h-15"
          />
        </div>
      )}

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
