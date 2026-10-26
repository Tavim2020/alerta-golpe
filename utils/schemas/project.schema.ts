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
  images = z
    .custom<string | File | null>(
      (value) =>
        value === null ||
        typeof value === "string" ||
        (typeof File !== "undefined" && value instanceof File) ||
        (typeof FileList !== "undefined" && value instanceof FileList),
      { error: this.stringDefaultError },
    )
    .transform((value): string | File | null => {
      if (typeof FileList !== "undefined" && value instanceof FileList) {
        return value.item(0);
      }

      return value as string | File | null;
    })
    .pipe(
      z.union([
        z.string({ error: this.stringDefaultError }),
        this.fileOrUrlSchema({
          maxSize: imagePropsVerification.maxSize,
          mbSize: imagePropsVerification.mbSize,
          accepts: imagePropsVerification.imagesAccepts,
          formats: imagePropsVerification.formats,
          label: "Imagem",
        }),
        z.null(),
      ]),
    )
    .superRefine((value, ctx) => {
      if (value === null) {
        ctx.addIssue({
          code: "custom",
          message: "Imagem é obrigatória",
        });
      }
    });

  email = z
    .email({ error: "E-mail inválido" })
    .max(300, { error: this.maxCaracteresError(300) });

  markdown = z
    .string({ error: this.stringDefaultError })
    .min(30, { error: this.minCaracteresError(30) });

  trimString = z.string({ error: this.stringDefaultError }).trim();

  video = z
    .custom<string | File | null>(
      (value) =>
        value === null ||
        typeof value === "string" ||
        (typeof File !== "undefined" && value instanceof File) ||
        (typeof FileList !== "undefined" && value instanceof FileList),
      { error: this.stringDefaultError },
    )
    .transform((value): string | File | null => {
      if (typeof FileList !== "undefined" && value instanceof FileList) {
        return value.item(0);
      }

      return value as string | File | null;
    })
    .pipe(
      z.union([
        z.string({ error: this.stringDefaultError }).nullable(),
        this.fileOrUrlSchema({
          maxSize: videoPropsVerification.maxSize,
          mbSize: videoPropsVerification.mbSize,
          accepts: videoPropsVerification.videosAccepts,
          formats: videoPropsVerification.formats,
          label: "Vídeo",
        }),
        z.null(),
      ]),
    )
    .superRefine((value, ctx) => {
      if (value === null) {
        ctx.addIssue({
          code: "custom",
          message: "Vídeo é obrigatório",
        });
      }
    });

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

  instagram = z.url("Informe uma URL válida.").refine((value) => {
    try {
      const url = new URL(value);

      return (
        ["instagram.com", "www.instagram.com"].includes(
          url.hostname.toLowerCase(),
        ) &&
        /^\/[a-zA-Z0-9._]+\/?$/.test(url.pathname) &&
        !url.search &&
        !url.hash
      );
    } catch {
      return false;
    }
  }, "Informe uma URL válida de perfil do Instagram.");

  phone = this.nonEmptyString.min(1, this.minCaracteresError(1)).pipe(
    z
      .string()
      .regex(/^\d{10,11}$/, "Informe um telefone válido com DDD.")
      .refine((value) => {
        const number = value.slice(2);

        return number.length === 8 || number.length === 9;
      }, "Informe um telefone válido."),
  );

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
    video_file: this.video,
    thumbnail_file: this.images,
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
    phone: this.phone,
    instagram: this.instagram,
    photo_file: this.images,
  };

  sub_category = {
    category: this.nonEmptyString,
    name: this.name,
  };
}

export const ProjectSchemaInstance = new ProjectSchema();
