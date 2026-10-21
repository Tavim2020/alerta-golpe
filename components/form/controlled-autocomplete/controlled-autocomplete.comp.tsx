"use client";

import { Controller, FieldValues } from "react-hook-form";

import { IControlledAutocompleteProps } from "./controlled-autocomplete.type";
import { Autocomplete } from "./components/autocomplete";

export const ControlledAutocomplete = <GProps extends FieldValues>({
  name,
  control,
  ...props
}: IControlledAutocompleteProps<GProps>) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, formState: { errors } }) => (
        <Autocomplete {...props} name={name} field={field} errors={errors} />
      )}
    />
  );
};
