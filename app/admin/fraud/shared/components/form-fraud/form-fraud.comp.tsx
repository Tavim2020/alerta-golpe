"use client";

import { ControlledTextArea } from "@/components/form/controlled-text-area";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { formFraudSchema, FormFraudSchema } from "./schemas/form-fraud.schema";
import { IFormFraudProps } from "./form-fraud.type";
import { ButtonDefault } from "@/components/buttons/button-default";
import { ControlledInputText } from "@/components/form/controlled-input-text";
import { zodResolver } from "@hookform/resolvers/zod";
import { ControlledFile } from "@/components/form/controlled-file";
import { imagePropsVerification } from "@/app/admin/constants/image.constant";
import { videoPropsVerification } from "@/app/admin/constants/video.constant";
import { ControlledMarkdown } from "@/components/form/controlled-markdown";
import { ControlledAutocomplete } from "@/components/form/controlled-autocomplete";
import { IAutocompleteOption } from "@/components/form/controlled-autocomplete/components/autocomplete/autocomplete.type";
import { useMemo } from "react";
import { DynamicFields } from "@/app/admin/shared/components/dynamic-fields";

export const FormFraud = ({
  isPending,
  submit,
  fraud,
  allCategoriesOptions,
  allSubCategoriesOptions,
}: IFormFraudProps) => {
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormFraudSchema>({
    resolver: zodResolver(formFraudSchema),
    defaultValues: {
      title: fraud?.title || "",
      description: fraud?.description || "",
      category: fraud?.sub_category?.category?.id || "",
      sub_category: fraud?.sub_category?.id || "",
      context: fraud?.context || "",
      content: fraud?.content || "",
      tips: fraud?.tips || [],
      video_file: fraud?.video_url || null,
      thumbnail_file: fraud?.thumbnail_url || null,
    },
  });

  const categoryValue = useWatch({ control, name: "category" });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "tips",
  });

  const resetSubCategoryByCategory = (option: IAutocompleteOption) => {
    if (categoryValue !== option.value) setValue("sub_category", "");
  };

  const subCategoriesFiltered = useMemo(
    () =>
      allSubCategoriesOptions.filter(
        (subCategory) =>
          categoryValue && subCategory.categoryId === categoryValue,
      ),
    [allSubCategoriesOptions, categoryValue],
  );

  return (
    <form
      onSubmit={handleSubmit((data) => submit(data))}
      className="mt-6 space-y-4 border border-ink/15 bg-white p-6"
    >
      <ControlledInputText
        control={control}
        name="title"
        label="Título: *"
        required
        maxLength={100}
        placeholder="Título (ex: Golpe da falsa central do banco)..."
      />

      <ControlledTextArea
        control={control}
        name="description"
        label="Descrição: *"
        placeholder="Descrição do golpe..."
        rows={5}
        minLength={30}
        maxLength={255}
      />

      <ControlledAutocomplete
        control={control}
        name="category"
        required
        options={allCategoriesOptions}
        label={"Categoria: *"}
        placeholder="Ex: Online..."
        onChange={resetSubCategoryByCategory}
      />

      <ControlledAutocomplete
        control={control}
        name="sub_category"
        required
        options={subCategoriesFiltered}
        label={"Sub Categoria: *"}
        placeholder="Ex: Banco..."
        disabled={Boolean(categoryValue) === false}
      />

      <ControlledMarkdown
        control={control}
        name="context"
        label="Contexto: *"
        placeholder="Contexto da fraude..."
        required
      />

      <ControlledMarkdown
        control={control}
        name="content"
        label="Conteúdo: *"
        placeholder="Conteúdo da fraude..."
        required
      />

      <DynamicFields
        title="Dicas de prevenção"
        addButton={{
          title: "Adicionar dica",
          onClick: () =>
            append({
              title: "",
              description: "",
            }),
        }}
        fields={fields}
        remove={remove}
        render={(index) => (
          <>
            <ControlledInputText
              control={control}
              name={`tips.${index}.title`}
              placeholder="Título da dica..."
              minLength={5}
              maxLength={50}
            />

            <ControlledTextArea
              control={control}
              name={`tips.${index}.description`}
              placeholder="Descrição da dica..."
              minLength={15}
              maxLength={150}
              required
            />
          </>
        )}
        fieldError={errors?.tips}
      />

      <ControlledFile
        control={control}
        name={"video_file"}
        accept={videoPropsVerification.videosAccepts.join(", ")}
        label="Vídeo da fraud: *"
      />

      <ControlledFile
        control={control}
        name={"thumbnail_file"}
        accept={imagePropsVerification.imagesAccepts.join(", ")}
        label="Imagem de Thumbnail da fraud: *"
      />

      <ButtonDefault
        type="submit"
        disabled={isPending}
        className="w-full bg-sun text-black py-3 hover:bg-sun hover:text-black hover:brightness-95"
      >
        {isPending ? "Publicando…" : "Publicar vídeo"}
      </ButtonDefault>
    </form>
  );
};
