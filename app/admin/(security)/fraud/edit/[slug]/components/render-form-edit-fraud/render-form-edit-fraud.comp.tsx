"use client";

import { FormFraud } from "@/app/admin/(security)/fraud/shared/components/form-fraud";
import { IRenderFormEditFraudProps } from "./render-form-edit-fraud.type";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { FormFraudSchema } from "@/app/admin/(security)/fraud/shared/components/form-fraud/schemas/form-fraud.schema";
import { toast } from "react-toastify";
import { APP_ROUTE } from "@/routes/app.route";

export const RenderFormEditFraud = ({
  fraud,
  slug,
}: IRenderFormEditFraudProps) => {
  const router = useRouter();

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: FormFraudSchema) => {
      await new Promise((resolver) => setTimeout(resolver, 3000));
      console.log(slug);
      console.log(data);
      return true;
    },
    onSuccess: () => {
      toast.success("Fraude editada com sucesso!");
      router.push(APP_ROUTE.ADMIN.DASHBOARD.ROOT);
    },
    onError: (error) =>
      toast.error(error?.message || "Tivemos problemas ao editar a fraude."),
  });

  return (
    <FormFraud
      isPending={isPending}
      submit={(data) => mutate(data)}
      fraud={fraud}
    />
  );
};
