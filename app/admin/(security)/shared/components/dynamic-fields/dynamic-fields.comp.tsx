"use client";

import { ButtonDefault } from "@/components/buttons/button-default";
import { ParagraphError } from "@/components/form/error-message-custom/components/paragraph-error";
import { IDynamicFieldsProps } from "./dynamic-fields.type";
import { FieldValues } from "react-hook-form";

export const DynamicFields = <GProps extends FieldValues>({
  title,
  addButton,
  fields,
  remove,
  render,
  fieldError,
}: IDynamicFieldsProps<GProps>) => {
  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <h2 className="font-display text-xl">{title}</h2>

        <ButtonDefault
          onClick={addButton.onClick}
          className="bg-sun text-black hover:bg-sun hover:text-black hover:brightness-95"
        >
          {addButton.title}
        </ButtonDefault>
      </div>

      {fields.length === 0 && (
        <p className="text-sm text-ink/60">Nenhuma item adicionado.</p>
      )}

      {fields.map((item, index) => (
        <div key={item.id} className="space-y-3 border border-ink/15 p-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">Item {index + 1}</h3>

            <ButtonDefault
              onClick={() => remove(index)}
              className="text-sm text-red-600 bg-white hover:bg-white hover:underline disabled:opacity-50"
            >
              Remover
            </ButtonDefault>
          </div>

          {render(index)}
        </div>
      ))}

      {fieldError?.message && (
        <ParagraphError>{fieldError.message}</ParagraphError>
      )}
    </div>
  );
};
