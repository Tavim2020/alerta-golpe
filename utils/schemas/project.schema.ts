import { imagePropsVerification } from "@/app/admin/constants/image.constant";
import { videoPropsVerification } from "@/app/admin/constants/video.constant";
import z from "zod";

class ProjectSchema {
  // string
  private stringDefaultError = "O campo é uma string";

  // functions
  private minCaracteresError = (number: number) =>
    `Mínimo ${number} caracteres`;
  private maxCaracteresError = (number: number) =>
    `Máximo ${number} caracteres`;

  private fileOrUrlSchema = (config: {
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

  // validators
  images = z.union([
    z.string({ error: "O valor deve ser uma string" }),
    this.fileOrUrlSchema({
      maxSize: imagePropsVerification.maxSize,
      mbSize: imagePropsVerification.mbSize,
      accepts: imagePropsVerification.imagesAccepts,
      formats: imagePropsVerification.formats,
      label: "Imagem",
    }),
    z.null(),
  ]);

  email = z
    .email({ error: "E-mail inválido" })
    .max(300, { error: this.maxCaracteresError(300) });

  markdown = z
    .string({ error: this.stringDefaultError })
    .min(30, { error: this.minCaracteresError(30) });

  trimString = z.string({ error: this.stringDefaultError }).trim();

  video = z.union([
    z.string({ error: "O valor deve ser uma string" }),
    this.fileOrUrlSchema({
      maxSize: videoPropsVerification.maxSize,
      mbSize: videoPropsVerification.mbSize,
      accepts: videoPropsVerification.videosAccepts,
      formats: videoPropsVerification.formats,
      label: "Vídeo",
    }),
    z.null(),
  ]);

  name = this.trimString
    .min(3, { error: this.minCaracteresError(3) })
    .max(20, { error: this.maxCaracteresError(20) });

  nonEmptyString = this.trimString.nonempty({
    error: "O campo não pode ser vazio.",
  });

  password = this.trimString
    .min(8, { error: this.minCaracteresError(8) })
    .max(40, { error: this.maxCaracteresError(40) });

  // objects
  category = {
    name: this.name,
  };

  fraud = {
    title: this.trimString
      .min(3, { error: this.minCaracteresError(3) })
      .max(100, { error: this.maxCaracteresError(100) }),
    description: this.trimString
      .min(30, { error: this.minCaracteresError(30) })
      .max(255, { error: this.maxCaracteresError(255) }),
    category: this.nonEmptyString,
    sub_category: this.nonEmptyString,
    context: this.markdown,
    content: this.markdown,
    tips: z
      .array(
        z.object({
          title: z
            .string({ error: this.stringDefaultError })
            .min(5, { error: this.minCaracteresError(5) })
            .max(50, { error: this.maxCaracteresError(50) }),
          description: z
            .string({ error: this.stringDefaultError })
            .min(15, { error: this.minCaracteresError(15) })
            .max(150, { error: this.maxCaracteresError(150) }),
        }),
      )
      .refine((value) => value.length, { error: "Deve sempre haver uma dica" }),
    video_file: this.video.superRefine((value, ctx) => {
      if (value === null) {
        ctx.addIssue({
          code: "custom",
          message: "Vídeo é obrigatório",
        });
      }
    }),
    thumbnail_file: this.images.superRefine((value, ctx) => {
      if (value === null) {
        ctx.addIssue({
          code: "custom",
          message: "Imagem é obrigatória",
        });
      }
    }),
  };

  lawyer = {
    name: this.trimString
      .min(3, { error: this.minCaracteresError(3) })
      .max(100, { error: this.maxCaracteresError(10) }),
    bio: this.markdown,
    specialty: z
      .array(
        z.object({
          content: this.trimString
            .min(3, { error: this.minCaracteresError(3) })
            .max(40, { error: this.minCaracteresError(40) }),
        }),
      )
      .refine((value) => value.length, {
        error: "Deve sempre haver uma especialidade",
      }),
    photo_file: this.images.superRefine((value, ctx) => {
      if (value === null) {
        ctx.addIssue({
          code: "custom",
          message: "Imagem é obrigatória",
        });
      }
    }),
  };

  sub_category = {
    category: this.nonEmptyString,
    name: this.name,
  };
}

export const ProjectSchemaInstance = new ProjectSchema();
