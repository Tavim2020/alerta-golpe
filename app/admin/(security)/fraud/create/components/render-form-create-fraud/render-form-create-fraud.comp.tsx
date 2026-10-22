"use client";

import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { APP_ROUTE } from "@/routes/app.route";
import { API_ROUTE } from "@/routes/api.route";
import { FormFraudSchema } from "@/app/admin/(security)/fraud/shared/components/form-fraud/schemas/form-fraud.schema";
import { BackButton } from "@/app/admin/(security)/shared/components/back-button";
import { FormFraud } from "@/app/admin/(security)/fraud/shared/components/form-fraud";
import { IRenderFormCreateFraudProps } from "./render-form-create-fraud.type";

export const RenderFormCreateFraud = ({
  allCategoriesOptions,
  allSubCategoriesOptions,
}: IRenderFormCreateFraudProps) => {
  const router = useRouter();

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: FormFraudSchema) => {
      const formData = new FormData();

      Object.entries(data).forEach(([key, value]) => {
        if (value) {
          if (Array.isArray(value)) formData.append(key, JSON.stringify(value));
          else formData.append(key, value);
        }
      });

      const response = await fetch(API_ROUTE.FRAUDS.CREATE, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const result = await response.json().catch(() => null);

        throw new Error(
          result?.message ?? "Tivemos problemas ao cadastrar a fraude",
        );
      }

      return response.json();
    },
    onSuccess: () => {
      toast.success("Fraude cadastradas com sucesso!");
      router.push(APP_ROUTE.ADMIN.DASHBOARD.ROOT);
    },
    onError: (error) =>
      toast.error(error?.message || "Tivemos problemas ao cadastrar a fraude."),
  });

  return (
    <>
      <BackButton title="Cadastro de Fraud" />

      <FormFraud
        isPending={isPending}
        submit={(data) => mutate(data)}
        allCategoriesOptions={allCategoriesOptions}
        allSubCategoriesOptions={allSubCategoriesOptions}
      />
    </>
  );
};
