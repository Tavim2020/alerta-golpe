import { ProjectSchemaInstance } from "@/utils/schemas/project.schema";
import z from "zod";

export const adminLoginSchema = z.object({
  email: ProjectSchemaInstance.email,
  password: ProjectSchemaInstance.password,
});

export type AdminLoginSchema = z.infer<typeof adminLoginSchema>;
