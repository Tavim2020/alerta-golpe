"use client";

import { useRouter } from "next/navigation";
import { FormFraud } from "../shared/components/form-fraud";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { FormFraudSchema } from "../shared/components/form-fraud/schemas/form-fraud.schema";
import { APP_ROUTE } from "@/routes/app.route";
import { BackButton } from "../../shared/components/back-button";

export default function AdminDashboard() {
  const router = useRouter();

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: FormFraudSchema) => {
      await new Promise((resolver) => setTimeout(resolver, 3000));
      console.log(data);
      return true;
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

      <FormFraud isPending={isPending} submit={(data) => mutate(data)} />
    </>
  );
}
