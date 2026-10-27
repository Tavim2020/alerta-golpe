"use client";

import { ButtonDefault } from "@/components/buttons/button-default";
import { ErrorMessageCustom } from "@/components/form/error-message-custom";
import { Label } from "@/components/form/label";
import { cn } from "@/libs/utils";
import Link from "next/link";
import { IInputFileProps } from "./input-file.type";
import { FieldValues } from "react-hook-form";

export const InputFile = <GProps extends FieldValues>({
  field,
  wrapperClassName,
  name,
  label,
  disabled,
  accept,
  required,
  inputClassName,
  errors,
}: IInputFileProps<GProps>) => {
  const currentFile = field.value as File | string | null;
  const isUrl = typeof currentFile === "string";
  const isFile = typeof File !== "undefined" && currentFile instanceof File;

  return (
    <div className={cn("w-full", wrapperClassName)}>
      <Label htmlFor={name}>{label}</Label>

      {isUrl && (
        <div className="flex items-center justify-between gap-3 border border-ink/15 p-3">
          <Link
            href={currentFile}
            target="_blank"
            rel="noopener noreferrer"
            className="truncate text-sm text-blue-600 underline"
          >
            Visualizar arquivo cadastrado
          </Link>

          <ButtonDefault
            variant="clean"
            disabled={disabled}
            onClick={() => field.onChange(null)}
            className="text-red-600"
          >
            Remover
          </ButtonDefault>
        </div>
      )}

      {isFile && (
        <p className="break-all text-sm text-ink/70">
          Arquivo selecionado: {currentFile.name}
        </p>
      )}

      <input
        {...field}
        value={
          field.value && typeof field.value === "object"
            ? field.value?.filename
            : undefined
        }
        id={name}
        name={name}
        type="file"
        accept={accept}
        required={required}
        className={cn(
          "w-full border border-dashed border-ink/40 p-4 cursor-pointer",
          inputClassName,
        )}
        disabled={disabled}
      />

      <ErrorMessageCustom errors={errors} name={name} />
    </div>
  );
};
