import { TFraud } from "@/types/global.type";
import { FormFraudSchema } from "./schemas/form-fraud.schema";

export interface IFormFraudProps {
  isPending: boolean;
  submit: (data: FormFraudSchema) => void;
  fraud?: TFraud;
}
