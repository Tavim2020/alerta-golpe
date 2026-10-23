"use client";

import { useMutation } from "@tanstack/react-query";
import { FormSubCategories } from "@/app/admin/(security)/sub-categories/shared/components/form-sub-categories";
import { FormSubCategoriesSchema } from "@/app/admin/(security)/sub-categories/shared/components/form-sub-categories/schemas/form-sub-categories.schema";
import { API_ROUTE } from "@/routes/api.route";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { APP_ROUTE } from "@/routes/app.route";
import { BackButton } from "@/app/admin/(security)/shared/components/back-button";
import { IRenderCreateSubCategoriesProps } from "./render-create-sub-categories.type";

export const RenderCreateSubCategories = ({
  allCategoriesOptions,
}: IRenderCreateSubCategoriesProps) => {
  const router = useRouter();

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: FormSubCategoriesSchema) => {
      const response = await fetch(API_ROUTE.SUB_CATEGORIES.CREATE, {
        method: "POST",
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const result = await response.json().catch(() => null);

        throw new Error(
          result?.message ?? "Tivemos problemas ao cadastrar a sub categoria.",
        );
      }

      return response.json();
    },
    onSuccess: () => {
      toast.success("Sub categoria cadastrada com sucesso!");
      router.push(APP_ROUTE.ADMIN.CATEGORIES.ROOT());
    },
    onError: (error) =>
      toast.error(
        error?.message || "Tivemos problemas ao cadastrar a sub categoria.",
      ),
  });

  return (
    <main className="mx-auto w-full max-w-7xl space-y-8 py-8">
      <BackButton
        title="Cadastro de Sub Categoria"
        href={APP_ROUTE.ADMIN.SUB_CATEGORIES.ROOT()}
      />

      <FormSubCategories
        isPending={isPending}
        submit={(data) => mutate(data)}
        allCategoriesOptions={allCategoriesOptions}
      />
    </main>
  );
};
