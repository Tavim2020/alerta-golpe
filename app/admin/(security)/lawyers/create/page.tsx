"use client";

import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { APP_ROUTE } from "@/routes/app.route";
import { API_ROUTE } from "@/routes/api.route";
import { FormFraudSchema } from "@/app/admin/(security)/fraud/shared/components/form-fraud/schemas/form-fraud.schema";
import { BackButton } from "@/app/admin/(security)/shared/components/back-button";
import { FormLawyer } from "../shared/components/form-lawyer";

const CreateLawyers = () => {
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

      const response = await fetch(API_ROUTE.LAWYERS.CREATE, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const result = await response.json().catch(() => null);

        throw new Error(
          result?.message ?? "Tivemos problemas ao cadastrar o(a) advogado(a)",
        );
      }

      return response.json();
    },
    onSuccess: () => {
      toast.success("Advogado(a) cadastrado(a) com sucesso!");
      router.push(APP_ROUTE.ADMIN.LAWYERS.ROOT());
    },
    onError: (error) =>
      toast.error(
        error?.message || "Tivemos problemas ao cadastrar o(a) advogado(a)",
      ),
  });

  return (
    <>
      <BackButton
        title="Cadastro de Advogado(a)"
        href={APP_ROUTE.ADMIN.LAWYERS.ROOT()}
      />

      <FormLawyer isPending={isPending} submit={(data) => console.log(data)} />
    </>
  );
};

export default CreateLawyers;
