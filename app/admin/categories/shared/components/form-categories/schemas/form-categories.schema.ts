import z from "zod";

export const formCategoriesSchema = z.object({
  name: z
    .string({ error: "O campo é uma string" })
    .trim()
    .min(3, { error: "Mínimo 3 caracteres." })
    .max(20, { error: "Máximo 20 caracteres." }),
});

export type FormCategoriesSchema = z.infer<typeof formCategoriesSchema>;
