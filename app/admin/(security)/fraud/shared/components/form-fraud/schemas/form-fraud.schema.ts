import { imagePropsVerification } from "@/app/admin/(security)/fraud/shared/components/form-fraud/constants/image.constant";
import { videoPropsVerification } from "@/app/admin/(security)/fraud/shared/components/form-fraud/constants/video.constant";
import z from "zod";

export const formFraudSchema = z.object({
  title: z
    .string({ error: "O campo deve ser uma string" })
    .max(100, { error: "Máximo 100 caracteres" }),
  description: z
    .string({ error: "O campo deve ser uma string" })
    .min(30, { error: "Mínimo 30 caracteres" })
    .max(255, { error: "Máximo 255 caracteres" }),
  context: z.string({ error: "O campo deve ser uma string" }),
  content: z.string({ error: "O campo deve ser uma string" }),
  tips: z
    .array(
      z.object({
        title: z
          .string({ error: "O campo deve ser uma string" })
          .min(5, { error: "Mínimo 5 caracteres" })
          .max(50, { error: "Máximo 50 caracteres" }),
        description: z
          .string({ error: "O campo deve ser uma string" })
          .min(15, { error: "Mínimo 15 caracteres" })
          .max(150, { error: "Máximo 150 caracteres" }),
      }),
    )
    .refine((value) => value.length, { error: "Deve sempre haver uma dica" }),
  video_file: z
    .instanceof(File, { message: "Imagem obrigatória" })
    .nullable()
    .refine(
      (file) => {
        if (!file) return false;

        return file.size <= videoPropsVerification.maxSize;
      },
      {
        message: `Vídeo não encontrado ou muito grande. Tamanho máximo: ${videoPropsVerification.mbSize}MB`,
      },
    )
    .refine(
      (file) => {
        if (!file) return false;

        return videoPropsVerification.videosAccepts.includes(file.type);
      },
      {
        message: `Vídeo não encontrado ou com formato inválido. Formatos: ${videoPropsVerification.formats}`,
      },
    ),
  thumbnail_file: z
    .instanceof(File, { message: "Imagem obrigatória" })
    .nullable()
    .refine(
      (file) => {
        if (!file) return false;

        return file.size <= imagePropsVerification.maxSize;
      },
      {
        message: `Imagem não encontrada ou muito grande. Tamanho máximo: ${imagePropsVerification.mbSize}MB`,
      },
    )
    .refine(
      (file) => {
        if (!file) return false;

        return imagePropsVerification.imagesAccepts.includes(file.type);
      },
      {
        message: `Imagem não encontrada ou com formato inválido. Formatos: ${imagePropsVerification.formats}`,
      },
    ),
});

export type FormFraudSchema = z.infer<typeof formFraudSchema>;
