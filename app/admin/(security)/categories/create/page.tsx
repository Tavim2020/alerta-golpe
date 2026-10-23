"use client";

import { useMutation } from "@tanstack/react-query";
import { FormCategories } from "../shared/components/form-categories";
import { FormCategoriesSchema } from "../shared/components/form-categories/schemas/form-categories.schema";
import { API_ROUTE } from "@/routes/api.route";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { APP_ROUTE } from "@/routes/app.route";
import { BackButton } from "../../shared/components/back-button";

const CreateCategoryPage = () => {
  const router = useRouter();

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: FormCategoriesSchema) => {
      const response = await fetch(API_ROUTE.CATEGORIES.CREATE, {
        method: "POST",
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const result = await response.json().catch(() => null);

        throw new Error(
          result?.message ?? "Tivemos problemas ao cadastrar a categoria.",
        );
      }

      return response.json();
    },
    onSuccess: () => {
      toast.success("Categoria cadastrada com sucesso!");
      router.push(APP_ROUTE.ADMIN.CATEGORIES.ROOT());
    },
    onError: (error) =>
      toast.error(
        error?.message || "Tivemos problemas ao cadastrar a categoria.",
      ),
  });

  return (
    <main className="mx-auto w-full max-w-7xl space-y-8 py-8">
      <BackButton
        title="Cadastro de Categoria"
        href={APP_ROUTE.ADMIN.CATEGORIES.ROOT()}
      />
      <FormCategories isPending={isPending} submit={(data) => mutate(data)} />
    </main>
  );
};

export default CreateCategoryPage;
