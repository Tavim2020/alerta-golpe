"use client";

import { Controller, FieldValues } from "react-hook-form";
import { IControlledFile } from "./controlled-file.type";
import { InputFile } from "./components/input-file";

export const ControlledFile = <GProps extends FieldValues>({
  name,
  control,
  ...props
}: IControlledFile<GProps>) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, formState: { errors } }) => (
        <InputFile name={name} {...props} field={field} errors={errors} />
      )}
    />
  );
};
