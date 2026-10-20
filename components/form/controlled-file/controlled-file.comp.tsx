"use client";

import { Controller, FieldValues } from "react-hook-form";
import { IControlledFile } from "./controlled-file.type";
import { cn } from "@/libs/utils";
import { ErrorMessageCustom } from "../error-message-custom";

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
      render={({ field, formState: { errors } }) => (
        <div className={cn("w-full", wrapperClassName)}>
          <label htmlFor={name}>{placeholder}</label>

          <input
            {...field}
            value={field.value ? field.value.filename : undefined}
            id={name}
            name={name}
            type="file"
            accept={accept}
            required={required}
            className={cn(
              "w-full border border-dashed border-ink/40 p-4",
              inputClassName,
            )}
            disabled={disabled}
          />

          <ErrorMessageCustom errors={errors} name={name} />
        </div>
      )}
    />
  );
};
