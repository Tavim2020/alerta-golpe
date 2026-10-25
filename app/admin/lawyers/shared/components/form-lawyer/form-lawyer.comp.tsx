"use client";

import { useFieldArray, useForm } from "react-hook-form";
import {
  formLawyerSchema,
  FormLawyerSchema,
} from "./schemas/form-lawyer.schema";
import { IFormLawyerProps } from "./form-lawyer.type";
import { ButtonDefault } from "@/components/buttons/button-default";
import { ControlledInputText } from "@/components/form/controlled-input-text";
import { zodResolver } from "@hookform/resolvers/zod";
import { ControlledFile } from "@/components/form/controlled-file";
import { ControlledMarkdown } from "@/components/form/controlled-markdown";
import { imagePropsVerification } from "@/app/admin/constants/image.constant";
import { DynamicFields } from "@/app/admin/shared/components/dynamic-fields";

export const FormLawyer = ({ isPending, submit, lawyer }: IFormLawyerProps) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormLawyerSchema>({
    resolver: zodResolver(formLawyerSchema),
    defaultValues: {
      name: lawyer?.name || "",
      bio: lawyer?.bio || "",
      specialty: lawyer?.specialty
        ? lawyer.specialty.map((value) => ({
            content: value,
          }))
        : [],
      photo_file: lawyer?.photo_url || null,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "specialty",
  });

  return (
    <form
      onSubmit={handleSubmit((data) => submit(data))}
      className="mt-6 space-y-4 border border-ink/15 bg-white p-6"
    >
      <ControlledInputText
        control={control}
        name="name"
        label="Nome: *"
        required
        maxLength={100}
        placeholder="Nome (ex: Bianca)..."
      />

      <ControlledMarkdown
        control={control}
        name="bio"
        label="Biografia: *"
        placeholder="Advogado(a) há tantos anos..."
        required
      />

      <DynamicFields
        title="Especialidades"
        addButton={{
          title: "Adicionar especialidade",
          onClick: () =>
            append({
              content: "",
            }),
        }}
        fields={fields}
        remove={remove}
        render={(index) => (
          <ControlledInputText
            control={control}
            name={`specialty.${index}.content`}
            placeholder="Conteúdo..."
            minLength={5}
            maxLength={50}
          />
        )}
        fieldError={errors?.specialty}
      />

      <ControlledFile
        control={control}
        name={"photo_file"}
        accept={imagePropsVerification.imagesAccepts.join(", ")}
        label="Imagem do Advogado(a): *"
      />

      <ButtonDefault
        type="submit"
        disabled={isPending}
        className="w-full bg-sun text-black py-3 hover:bg-sun hover:text-black hover:brightness-95"
      >
        {isPending ? "Salvando…" : "Salvar Advogado(a)"}
      </ButtonDefault>
    </form>
  );
};
