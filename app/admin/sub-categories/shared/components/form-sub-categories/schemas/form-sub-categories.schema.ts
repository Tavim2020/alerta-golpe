import { ProjectSchemaInstance } from "@/utils/schemas/project.schema";
import z from "zod";

export const formSubCategoriesSchema = z.object(
  ProjectSchemaInstance.sub_category,
);

export type FormSubCategoriesSchema = z.infer<typeof formSubCategoriesSchema>;
