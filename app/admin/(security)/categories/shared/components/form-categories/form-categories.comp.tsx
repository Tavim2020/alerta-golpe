"use client";

import { ControlledInputText } from "@/components/form/controlled-input-text";
import { useForm } from "react-hook-form";
import {
  formCategoriesSchema,
  FormCategoriesSchema,
} from "./schemas/form-categories.schema";
import { IFormCategoriesProps } from "./form-categories.type";
import { ButtonDefault } from "@/components/buttons/button-default";
import { zodResolver } from "@hookform/resolvers/zod";

export const FormCategories = ({
  category,
  submit,
  isPending,
}: IFormCategoriesProps) => {
  const { control, handleSubmit } = useForm<FormCategoriesSchema>({
    resolver: zodResolver(formCategoriesSchema),
    defaultValues: {
      name: category?.name || "",
    },
  });

  return (
    <form
      onSubmit={handleSubmit((formData) => submit(formData))}
      className="mt-6 space-y-4 border border-ink/15 bg-white p-6"
    >
      <ControlledInputText
        control={control}
        name="name"
        label="Nome: *"
        required
        minLength={3}
        maxLength={25}
        placeholder="Nome (ex: Online)..."
      />

      <ButtonDefault
        type="submit"
        disabled={isPending}
        className="w-full bg-sun text-black py-3 hover:bg-sun hover:text-black hover:brightness-95"
      >
        {isPending ? "Publicando…" : "Publicar Categoria"}
      </ButtonDefault>
    </form>
  );
};
