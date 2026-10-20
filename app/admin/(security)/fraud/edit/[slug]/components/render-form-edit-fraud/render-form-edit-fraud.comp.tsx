"use client";

import { FormFraud } from "@/app/admin/(security)/fraud/shared/components/form-fraud";
import { IRenderFormEditFraudProps } from "./render-form-edit-fraud.type";

export const RenderFormEditFraud = ({ fraud }: IRenderFormEditFraudProps) => {
  return (
    <FormFraud
      isPending={false}
      submit={(data) => console.log(data)}
      fraud={fraud}
    />
  );
};
