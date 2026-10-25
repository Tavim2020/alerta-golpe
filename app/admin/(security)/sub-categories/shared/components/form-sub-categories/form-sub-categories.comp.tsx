"use client";

import { ControlledInputText } from "@/components/form/controlled-input-text";
import { useForm } from "react-hook-form";
import {
  formSubCategoriesSchema,
  FormSubCategoriesSchema,
} from "./schemas/form-sub-categories.schema";
import { IFormSubCategoriesProps } from "./form-sub-categories.type";
import { ButtonDefault } from "@/components/buttons/button-default";
import { zodResolver } from "@hookform/resolvers/zod";
import { ControlledAutocomplete } from "@/components/form/controlled-autocomplete";

export const FormSubCategories = ({
  subCategory,
  submit,
  isPending,
  allCategoriesOptions,
}: IFormSubCategoriesProps) => {
  const { control, handleSubmit } = useForm<FormSubCategoriesSchema>({
    resolver: zodResolver(formSubCategoriesSchema),
    defaultValues: {
      category: subCategory?.category_id || "",
      name: subCategory?.name || "",
    },
  });

  return (
    <form
      onSubmit={handleSubmit((formData) => submit(formData))}
      className="mt-6 space-y-4 border border-ink/15 bg-white p-6"
    >
      <ControlledAutocomplete
        control={control}
        name="category"
        label="Categoria: *"
        required
        placeholder="Categoria (ex: Online)..."
        options={allCategoriesOptions}
      />

      <ControlledInputText
        control={control}
        name="name"
        label="Nome: *"
        required
        minLength={3}
        maxLength={25}
        placeholder="Nome (ex: Banco)..."
      />

      <ButtonDefault
        type="submit"
        disabled={isPending}
        className="w-full bg-sun text-black py-3 hover:bg-sun hover:text-black hover:brightness-95"
      >
        {isPending ? "Publicando…" : "Publicar Sub Categoria"}
      </ButtonDefault>
    </form>
  );
};
