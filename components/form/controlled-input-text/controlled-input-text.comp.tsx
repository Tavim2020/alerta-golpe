"use client";

import { Controller, FieldValues } from "react-hook-form";
import { IControlledInputText } from "./controlled-input-text.type";
import { ErrorMessageCustom } from "../error-message-custom";
import { cn } from "@/libs/utils";
import { Label } from "../label";
import { ChangeEvent } from "react";

export const ControlledInputText = <GProps extends FieldValues>({
  wrapperClassName,
  inputClassName,
  name,
  control,
  formatOnValue = (value) => value,
  formatOnChange = (value) => value,
  type = "text",
  label,
  placeholder,
  disabled,
  minLength,
  maxLength,
  required,
  prefixes,
}: IControlledInputText<GProps>) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, formState: { errors } }) => {
        const fieldValue = String(field.value ?? "");

        const matchedPrefix = prefixes?.find((item) =>
          fieldValue.startsWith(item),
        );

        const inputValue = matchedPrefix
          ? fieldValue.slice(matchedPrefix.length)
          : fieldValue;

        const onChange = ({
          target,
        }: ChangeEvent<HTMLInputElement, HTMLInputElement>) => {
          const rawValue = target.value;

          const pastedPrefix = prefixes?.find((item) =>
            rawValue.startsWith(item),
          );

          const value = pastedPrefix
            ? rawValue.slice(pastedPrefix.length)
            : rawValue;

          const formattedValue = formatOnChange(value);
          const activePrefix = pastedPrefix ?? matchedPrefix;

          field.onChange(
            activePrefix ? `${activePrefix}${formattedValue}` : formattedValue,
          );
        };

        return (
          <div className={cn("w-full", wrapperClassName)}>
            <Label htmlFor={name}>{label}</Label>

            <div className="flex w-full items-center overflow-hidden rounded-md border border-ink/30 focus-within:ring-2 focus-within:ring-primary/30">
              {prefixes?.length ? (
                <span
                  className="hidden shrink-0 select-none pl-3 pr-2 text-sm text-ink/60 sm:block"
                  aria-hidden="true"
                >
                  {matchedPrefix ?? prefixes[0]}
                </span>
              ) : null}

              <input
                {...field}
                value={formatOnValue(inputValue)}
                onChange={onChange}
                type={type}
                id={name}
                placeholder={placeholder}
                className={cn(
                  "min-w-0 flex-1 bg-transparent p-3 outline-none",
                  inputClassName,
                )}
                disabled={disabled}
                minLength={minLength}
                maxLength={maxLength}
                required={required}
              />
            </div>

            <ErrorMessageCustom errors={errors} name={name} />
          </div>
        );
      }}
    />
  );
};
