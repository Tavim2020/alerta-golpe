"use client";

import { DeleteButton } from "@/app/admin/(security)/shared/components/delete-button";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { FormCategoriesSchema } from "@/app/admin/(security)/categories/shared/components/form-categories/schemas/form-categories.schema";
import { API_ROUTE } from "@/routes/api.route";
import { IRenderFormSubCategoriesProps } from "./render-form-edit-sub-categories.type";
import { toast } from "react-toastify";
import { APP_ROUTE } from "@/routes/app.route";
import { FormSubCategories } from "@/app/admin/(security)/sub-categories/shared/components/form-sub-categories";

export const RenderFormEditSubCategories = ({
  subCategoryId,
  subCategory,
  allCategoriesOptions,
}: IRenderFormSubCategoriesProps) => {
  const router = useRouter();

  const { mutate: mutateEditSubCategory, isPending: isPendingEditSubCategory } =
    useMutation({
      mutationFn: async (data: FormCategoriesSchema) => {
        const response = await fetch(
          API_ROUTE.SUB_CATEGORIES.UPDATE_BY_ID(subCategoryId),
          {
            method: "PUT",
            body: JSON.stringify(data),
          },
        );

        if (!response.ok) {
          const result = await response.json().catch(() => null);

          throw new Error(
            result?.message ?? "Tivemos problemas ao editar a sub categoria.",
          );
        }

        return response.json();
      },
      onSuccess: () => {
        toast.success("Sub categoria editada com sucesso!");
        router.push(APP_ROUTE.ADMIN.SUB_CATEGORIES.ROOT());
      },
      onError: (error) =>
        toast.error(
          error?.message || "Tivemos problemas ao editar a sub categoria.",
        ),
    });

  const {
    mutate: mutateDeleteSubCategory,
    isPending: isPendingDeleteSubCategory,
  } = useMutation({
    mutationFn: async () => {
      const response = await fetch(
        API_ROUTE.SUB_CATEGORIES.DELETE_BY_ID(subCategoryId),
        {
          method: "DELETE",
        },
      );

      if (!response.ok) {
        const result = await response.json().catch(() => null);

        throw new Error(
          result?.message ?? "Tivemos problemas ao deletar a sub categoria.",
        );
      }

      return response.json();
    },
    onSuccess: () => {
      toast.success("Sub categoria deletada com sucesso!");
      router.push(APP_ROUTE.ADMIN.SUB_CATEGORIES.ROOT());
    },
    onError: (error) =>
      toast.error(
        error?.message || "Tivemos problemas ao deletar a sub categoria.",
      ),
  });

  return (
    <>
      <DeleteButton onDelete={() => mutateDeleteSubCategory()} />

      <FormSubCategories
        isPending={isPendingEditSubCategory || isPendingDeleteSubCategory}
        submit={(data) => mutateEditSubCategory(data)}
        subCategory={subCategory}
        allCategoriesOptions={allCategoriesOptions}
      />
    </>
  );
};
