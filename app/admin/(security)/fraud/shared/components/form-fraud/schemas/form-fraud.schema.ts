import { imagePropsVerification } from "@/app/admin/(security)/fraud/shared/components/form-fraud/constants/image.constant";
import { videoPropsVerification } from "@/app/admin/(security)/fraud/shared/components/form-fraud/constants/video.constant";
import z from "zod";

const fileOrUrlSchema = (config: {
  maxSize: number;
  mbSize: number;
  accepts: string[];
  formats: string;
  label: string;
}) =>
  z
    .custom<File>(
      (value) => typeof File !== "undefined" && value instanceof File,
    )
    .refine((file) => file.size <= config.maxSize, {
      message: `${config.label} muito grande. Tamanho máximo: ${config.mbSize}MB`,
    })
    .refine((file) => config.accepts.includes(file.type), {
      message: `Formato de ${config.label.toLowerCase()} inválido. Formatos: ${config.formats}`,
    });

const stringError = "O campo deve ser uma string";

export const formFraudSchema = z.object({
  title: z
    .string({ error: stringError })
    .max(100, { error: "Máximo 100 caracteres" }),
  description: z
    .string({ error: stringError })
    .min(30, { error: "Mínimo 30 caracteres" })
    .max(255, { error: "Máximo 255 caracteres" }),
  category: z.string({ error: stringError }),
  sub_category: z.string({ error: stringError }),
  context: z.string({ error: stringError }),
  content: z.string({ error: stringError }),
  tips: z
    .array(
      z.object({
        title: z
          .string({ error: stringError })
          .min(5, { error: "Mínimo 5 caracteres" })
          .max(50, { error: "Máximo 50 caracteres" }),
        description: z
          .string({ error: stringError })
          .min(15, { error: "Mínimo 15 caracteres" })
          .max(150, { error: "Máximo 150 caracteres" }),
      }),
    )
    .refine((value) => value.length, { error: "Deve sempre haver uma dica" }),
  video_file: z.union([
    z.string({ error: "O valor deve ser uma string" }),
    fileOrUrlSchema({
      maxSize: videoPropsVerification.maxSize,
      mbSize: videoPropsVerification.mbSize,
      accepts: videoPropsVerification.videosAccepts,
      formats: videoPropsVerification.formats,
      label: "Vídeo",
    }),
    z.null(),
  ]),
  thumbnail_file: z.union([
    z.string({ error: "O valor deve ser uma string" }),
    fileOrUrlSchema({
      maxSize: imagePropsVerification.maxSize,
      mbSize: imagePropsVerification.mbSize,
      accepts: imagePropsVerification.imagesAccepts,
      formats: imagePropsVerification.formats,
      label: "Imagem",
    }),
    z.null(),
  ]),
});

export type FormFraudSchema = z.infer<typeof formFraudSchema>;
