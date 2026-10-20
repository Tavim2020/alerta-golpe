import z from "zod";

export const adminLoginSchema = z.object({
  email: z.email({ error: "E-mail inválido" }),
  password: z
    .string({ error: "O campo deve ser uma string" })
    .min(8, { error: "Mínimo 8 caracteres" })
    .max(40, { error: "Máximo 40 caracteres" }),
});

export type AdminLoginSchema = z.infer<typeof adminLoginSchema>;
