"use client";

import { Controller, FieldValues } from "react-hook-form";
import { IControlledFile } from "./controlled-file.type";
import { cn } from "@/libs/utils";
import { ErrorMessageCustom } from "../error-message-custom";
import { ButtonDefault } from "@/components/buttons/button-default";
import Link from "next/link";

export const ControlledFile = <GProps extends FieldValues>({
  name,
  control,
  wrapperClassName,
  accept,
  required,
  inputClassName,
  placeholder,
  disabled,
}: IControlledFile<GProps>) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, formState: { errors } }) => {
        const currentFile = field.value as File | string | null;
        const isUrl = typeof currentFile === "string";
        const isFile =
          typeof File !== "undefined" && currentFile instanceof File;

        return (
          <div className={cn("w-full", wrapperClassName)}>
            <label htmlFor={name}>{placeholder}</label>

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
      }}
    />
  );
};
