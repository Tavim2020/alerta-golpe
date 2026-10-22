import { TServerDefaultResponse } from "@/types/global.type";

export type TFraudDashboard = {
  slug: string;
  title: string;
  description?: string;
};

export type TNextServerGetFrauds = TServerDefaultResponse<TFraudDashboard[]>;
