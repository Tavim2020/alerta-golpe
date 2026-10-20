"use client";

import { Controller, FieldValues } from "react-hook-form";
import { IControlledInputText } from "./controlled-input-text.type";
import { ErrorMessageCustom } from "../error-message-custom";
import { cn } from "@/libs/utils";

export const ControlledInputText = <GProps extends FieldValues>({
  wrapperClassName,
  inputClassName,
  name,
  control,
  formatOnValue = (value) => value,
  formatOnChange = (value) => value,
  type = "text",
  placeholder,
  disabled,
  minLength,
  maxLength,
  required,
}: IControlledInputText<GProps>) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, formState: { errors } }) => (
        <div className={cn("w-full", wrapperClassName)}>
          <input
            {...field}
            value={formatOnValue(field.value)}
            onChange={({ target }) =>
              field.onChange(formatOnChange(target.value))
            }
            name={name}
            type={type}
            id={name}
            placeholder={placeholder}
            className={cn("w-full border border-ink/30 p-3", inputClassName)}
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
