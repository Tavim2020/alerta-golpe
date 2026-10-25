import { ILawyer } from "@/types/global.type";
import { FormLawyerSchema } from "./schemas/form-lawyer.schema";

export interface IFormLawyerProps {
  isPending: boolean;
  submit: (data: FormLawyerSchema) => void;
  lawyer?: ILawyer;
}
