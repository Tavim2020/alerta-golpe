"use client";

import { FormCategories } from "@/app/admin/(security)/categories/shared/components/form-categories";
import { DeleteButton } from "@/app/admin/(security)/shared/components/delete-button";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { FormCategoriesSchema } from "@/app/admin/(security)/categories/shared/components/form-categories/schemas/form-categories.schema";
import { API_ROUTE } from "@/routes/api.route";
import { IRenderFormCategoriesProps } from "./render-form-categories.type";
import { toast } from "react-toastify";
import { APP_ROUTE } from "@/routes/app.route";

export const RenderFormCategories = ({
  categoryId,
  category,
}: IRenderFormCategoriesProps) => {
  const router = useRouter();

  const { mutate: mutateEditCategory, isPending: isPendingEditCategory } =
    useMutation({
      mutationFn: async (data: FormCategoriesSchema) => {
        const response = await fetch(
          API_ROUTE.CATEGORIES.UPDATE_BY_ID(categoryId),
          {
            method: "PUT",
            body: JSON.stringify(data),
          },
        );

        if (!response.ok) {
          const result = await response.json().catch(() => null);

          throw new Error(
            result?.message ?? "Tivemos problemas ao editar a categoria.",
          );
        }

        return response.json();
      },
      onSuccess: () => {
        toast.success("Categoria editada com sucesso!");
        router.push(APP_ROUTE.ADMIN.CATEGORIES.ROOT());
      },
      onError: (error) =>
        toast.error(
          error?.message || "Tivemos problemas ao editar a categoria.",
        ),
    });

  const { mutate: mutateDeleteCategory, isPending: isPendingDeleteCategory } =
    useMutation({
      mutationFn: async () => {
        const response = await fetch(
          API_ROUTE.CATEGORIES.DELETE_BY_ID(categoryId),
          {
            method: "DELETE",
          },
        );

        if (!response.ok) {
          const result = await response.json().catch(() => null);

          throw new Error(
            result?.message ?? "Tivemos problemas ao deletar a categoria.",
          );
        }

        return response.json();
      },
      onSuccess: () => {
        toast.success("Categoria deletada com sucesso!");
        router.push(APP_ROUTE.ADMIN.CATEGORIES.ROOT());
      },
      onError: (error) =>
        toast.error(
          error?.message || "Tivemos problemas ao deletar a categoria.",
        ),
    });

  return (
    <>
      <DeleteButton
        modalMessage="Essa ação só pode ocorrer se a categoria não tiver sub categoria vinculada a ela. Tem certeza de que deseja excluir este item? Esta ação não poderá ser desfeita."
        onDelete={() => mutateDeleteCategory()}
      />

      <FormCategories
        isPending={isPendingEditCategory || isPendingDeleteCategory}
        submit={(data) => mutateEditCategory(data)}
        category={category}
      />
    </>
  );
};
