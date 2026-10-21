"use client";

import { ControlledTextArea } from "@/components/form/controlled-text-area";
import { useFieldArray, useForm } from "react-hook-form";
import { formFraudSchema, FormFraudSchema } from "./schemas/form-fraud.schema";
import { IFormFraudProps } from "./form-fraud.type";
import { ButtonDefault } from "@/components/buttons/button-default";
import { ControlledInputText } from "@/components/form/controlled-input-text";
import { zodResolver } from "@hookform/resolvers/zod";
import { ControlledFile } from "@/components/form/controlled-file";
import { imagePropsVerification } from "./constants/image.constant";
import { videoPropsVerification } from "./constants/video.constant";
import { ControlledMarkdown } from "@/components/form/controlled-markdown";
import { ControlledAutocomplete } from "@/components/form/controlled-autocomplete";

export const FormFraud = ({ isPending, submit, fraud }: IFormFraudProps) => {
  const { control, handleSubmit } = useForm<FormFraudSchema>({
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

  const { fields, append, remove } = useFieldArray({
    control,
    name: "tips",
  });

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
        options={[
          { label: "abc", value: "44848809-aa0d-4d7a-b12f-14bffcfe03e8" },
        ]}
        label={"Categoria: *"}
        placeholder="Ex: Online..."
      />

      <ControlledAutocomplete
        control={control}
        name="sub_category"
        required
        options={[
          { label: "abc", value: "44848809-aa0d-4d7a-b12f-14bffcfe03e8" },
        ]}
        label={"Sub Categoria: *"}
        placeholder="Ex: Banco..."
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

      <div className="w-full space-y-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-display text-xl">Dicas de prevenção</h2>

          <ButtonDefault
            onClick={() =>
              append({
                title: "",
                description: "",
              })
            }
            className="bg-sun text-black hover:bg-sun hover:text-black hover:brightness-95"
          >
            Adicionar dica
          </ButtonDefault>
        </div>

        {fields.length === 0 && (
          <p className="text-sm text-ink/60">Nenhuma dica adicionada.</p>
        )}

        {fields.map((item, index) => (
          <div key={item.id} className="space-y-3 border border-ink/15 p-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Dica {index + 1}</h3>

              <ButtonDefault
                onClick={() => remove(index)}
                className="text-sm text-red-600 bg-white hover:bg-white hover:underline disabled:opacity-50"
              >
                Remover
              </ButtonDefault>
            </div>

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
          </div>
        ))}
      </div>

      <ControlledFile
        control={control}
        name={"video_file"}
        accept={videoPropsVerification.videosAccepts.join(", ")}
        label="Vídeo da fraud: *"
        required
      />

      <ControlledFile
        control={control}
        name={"thumbnail_file"}
        accept={imagePropsVerification.imagesAccepts.join(", ")}
        label="Imagem de Thumbnail da fraud: *"
        required
      />

      <ButtonDefault
        disabled={isPending}
        className="w-full bg-sun py-3 hover:brightness-95"
      >
        {isPending ? "Publicando…" : "Publicar vídeo"}
      </ButtonDefault>
    </form>
  );
};
