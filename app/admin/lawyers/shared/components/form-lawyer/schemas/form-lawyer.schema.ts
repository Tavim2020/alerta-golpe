import { ProjectSchemaInstance } from "@/utils/schemas/project.schema";
import z from "zod";

export const formLawyerSchema = z.object(ProjectSchemaInstance.lawyer);

export type FormLawyerSchema = z.infer<typeof formLawyerSchema>;
