import { imagePropsVerification } from "@/app/admin/(security)/constants/image.constant";
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

export const formLawyerSchema = z.object({
  name: z
    .string({ error: stringError })
    .max(100, { error: "Máximo 100 caracteres" }),
  bio: z.string({ error: stringError }),
  specialty: z
    .array(
      z.object({
        content: z
          .string({ error: stringError })
          .min(3, { error: "Mínimo 3 caracteres" })
          .max(40, { error: "Máximo 40 caracteres" }),
      }),
    )
    .refine((value) => value.length, {
      error: "Deve sempre haver uma especialidade",
    }),
  photo_file: z
    .union([
      z.string({ error: "O valor deve ser uma string" }),
      fileOrUrlSchema({
        maxSize: imagePropsVerification.maxSize,
        mbSize: imagePropsVerification.mbSize,
        accepts: imagePropsVerification.imagesAccepts,
        formats: imagePropsVerification.formats,
        label: "Imagem",
      }),
      z.null(),
    ])
    .superRefine((value, ctx) => {
      if (value === null) {
        ctx.addIssue({
          code: "custom",
          message: "Imagem é obrigatória",
        });
      }
    }),
});

export type FormLawyerSchema = z.infer<typeof formLawyerSchema>;
