import { ProjectSchemaInstance } from "@/utils/schemas/project.schema";
import z from "zod";

export const formCategoriesSchema = z.object(ProjectSchemaInstance.category);

export type FormCategoriesSchema = z.infer<typeof formCategoriesSchema>;
