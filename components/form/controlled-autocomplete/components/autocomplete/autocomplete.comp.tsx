"use client";

import { cn } from "@/libs/utils";
import { IAutocompleteOption, IAutoCompleteProps } from "./autocomplete.type";
import { FieldValues } from "react-hook-form";
import { ChangeEvent, useMemo, useState } from "react";
import { ErrorMessageCustom } from "@/components/form/error-message-custom";
import { ButtonDefault } from "@/components/buttons/button-default";
import { SelectionBox } from "./components/selection-box";
import { AutocompleteOption } from "./components/autocomplete-option";
import { AutocompleteEmptyOptions } from "./components/autocomplete-empty-options";
import { Label } from "@/components/form/label";

export const Autocomplete = <GProps extends FieldValues>({
  name,
  options,
  placeholder = "Buscar",
  disabled,
  multiple,
  wrapperClassName,
  inputClassName,
  required,
  field,
  label,
  errors,
  onChange,
}: IAutoCompleteProps<GProps>) => {
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const filteredOptions = useMemo(() => {
    const normalizedSearch = search.trim().toLocaleLowerCase("pt-BR");

    return options.filter((option) =>
      option.label.toLocaleLowerCase("pt-BR").includes(normalizedSearch),
    );
  }, [options, search]);

  const selectedValues: string[] = multiple
    ? Array.isArray(field.value)
      ? field.value
      : []
    : typeof field.value === "string" && field.value.length > 0
      ? [field.value]
      : [];

  const selectedOptions = options.filter((option) =>
    selectedValues.includes(option.value),
  );

  const selectOption = (option: IAutocompleteOption) => {
    if (multiple) {
      const alreadySelected = selectedValues.includes(option.value);

      field.onChange(
        alreadySelected
          ? selectedValues.filter((value) => value !== option.value)
          : [...selectedValues, option.value],
      );

      setSearch("");
      setIsOpen(true);
      return;
    }

    onChange?.(option);

    field.onChange(option.value);
    setSearch("");
    setIsOpen(false);
  };

  const inputValue =
    search ||
    (!multiple && selectedOptions.length > 0 && !isOpen
      ? selectedOptions[0].label
      : "");

  const inputChange = (
    event: ChangeEvent<HTMLInputElement, HTMLInputElement>,
  ) => {
    setSearch(event.target.value);
    setIsOpen(true);

    if (!multiple) {
      field.onChange("");
    }
  };

  const handleCleanField = () => {
    field.onChange(multiple ? [] : "");
    setSearch("");
    setIsOpen(true);
  };

  const closeOptions = () => {
    setIsOpen(false);
    setSearch("");
  };

  return (
    <div className={cn("relative w-full", wrapperClassName)}>
      <Label htmlFor={name}>{label}</Label>

      <div
        className={cn(
          "flex min-h-12 w-full flex-wrap items-center gap-2 border border-ink/30 bg-white p-2",
          inputClassName,
        )}
      >
        {multiple &&
          selectedOptions.map((option) => (
            <SelectionBox
              key={option.value}
              {...option}
              field={field}
              selectedValues={selectedValues}
            />
          ))}

        <input
          ref={field.ref}
          name={field.name}
          onBlur={() => field.onBlur()}
          autoComplete="off"
          value={inputValue}
          onChange={inputChange}
          onFocus={() => setIsOpen(true)}
          placeholder={
            multiple && selectedOptions.length > 0
              ? "Adicionar outra opção..."
              : placeholder
          }
          disabled={disabled}
          required={required && selectedValues.length === 0}
          role="combobox"
          aria-expanded={isOpen}
          aria-controls={`${String(name)}-options`}
          className="min-w-0 flex-1 bg-transparent p-1 outline-none"
        />

        {selectedValues.length > 0 && (
          <ButtonDefault
            variant="clean"
            disabled={disabled}
            onClick={handleCleanField}
            className="px-1 text-sm text-ink/60 hover:text-ink"
            aria-label="Limpar seleção"
          >
            Limpar
          </ButtonDefault>
        )}
      </div>

      {isOpen && !disabled && (
        <ul
          id={`${String(name)}-options`}
          role="listbox"
          aria-multiselectable={multiple}
          className="absolute z-20 mt-1 max-h-60 w-full overflow-y-auto border border-ink/20 bg-white py-1 shadow-lg"
        >
          {filteredOptions.length === 0 ? (
            <AutocompleteEmptyOptions />
          ) : (
            filteredOptions.map((option) => (
              <AutocompleteOption
                key={option.value}
                option={option}
                selectOption={selectOption}
                selectedValues={selectedValues}
              />
            ))
          )}

          <li className="border-t border-ink/10">
            <ButtonDefault
              variant="clean"
              onClick={closeOptions}
              className="w-full px-3 py-2 text-left text-xs text-ink/60 hover:bg-ink/5 justify-start"
            >
              Fechar
            </ButtonDefault>
          </li>
        </ul>
      )}

      <ErrorMessageCustom errors={errors} name={name} />
    </div>
  );
};
