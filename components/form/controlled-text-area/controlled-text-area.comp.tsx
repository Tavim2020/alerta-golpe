"use client";

import { Controller, FieldValues } from "react-hook-form";
import { IControlledTextArea } from "./controlled-text-area.type";
import { cn } from "@/libs/utils";
import { ErrorMessageCustom } from "../error-message-custom";
import { Label } from "../label";

export const ControlledTextArea = <GProps extends FieldValues>({
  name,
  control,
  wrapperClassName,
  rows,
  placeholder,
  label,
  textAreaClassName,
  disabled,
  minLength,
  maxLength,
  required,
}: IControlledTextArea<GProps>) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, formState: { errors } }) => (
        <div className={cn("w-full", wrapperClassName)}>
          <Label htmlFor={name}>{label}</Label>

          <textarea
            {...field}
            rows={rows}
            id={name}
            name={name}
            placeholder={placeholder}
            className={cn(
              "w-full border border-ink/30 p-3 min-h-50 resize-none",
              textAreaClassName,
            )}
            disabled={disabled}
            minLength={minLength}
            maxLength={maxLength}
            required={required}
          />

          <ErrorMessageCustom errors={errors} name={name} />
        </div>
      )}
    />
  );
};
