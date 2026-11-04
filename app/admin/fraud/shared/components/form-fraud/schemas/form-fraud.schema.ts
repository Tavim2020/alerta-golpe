import { ProjectSchemaInstance } from "@/utils/schemas/project.schema";
import z from "zod";

export const formFraudSchema = z.object(ProjectSchemaInstance.fraud);

export type FormFraudSchema = z.infer<typeof formFraudSchema>;
