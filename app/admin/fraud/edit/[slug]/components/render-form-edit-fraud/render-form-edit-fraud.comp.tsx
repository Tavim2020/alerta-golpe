"use client";

import { FormFraud } from "@/app/admin/fraud/shared/components/form-fraud";
import { IRenderFormEditFraudProps } from "./render-form-edit-fraud.type";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { FormFraudSchema } from "@/app/admin/fraud/shared/components/form-fraud/schemas/form-fraud.schema";
import { toast } from "react-toastify";
import { APP_ROUTE } from "@/routes/app.route";
import { DeleteButton } from "@/app/admin/shared/components/delete-button/delete-button.comp";
import { API_ROUTE } from "@/routes/api.route";

export const RenderFormEditFraud = ({
  fraud,
  slug,
  allCategoriesOptions,
  allSubCategoriesOptions,
}: IRenderFormEditFraudProps) => {
  const router = useRouter();

  const { mutate: mutateEditFraud, isPending: isPendingEditFraud } =
    useMutation({
      mutationFn: async (data: FormFraudSchema) => {
        const formData = new FormData();

        Object.entries(data).forEach(([key, value]) => {
          if (value) {
            if (Array.isArray(value))
              formData.append(key, JSON.stringify(value));
            else formData.append(key, value);
          }
        });

        const response = await fetch(API_ROUTE.FRAUDS.UPDATE_BY_SLUG(slug), {
          method: "PUT",
          body: formData,
        });

        if (!response.ok) {
          const result = await response.json().catch(() => null);

          throw new Error(
            result?.message ?? "Tivemos problemas ao editar a fraude.",
          );
        }

        return response.json();
      },
      onSuccess: () => {
        toast.success("Fraude editada com sucesso!");
        router.push(APP_ROUTE.ADMIN.DASHBOARD.ROOT);
      },
      onError: (error) =>
        toast.error(error?.message || "Tivemos problemas ao editar a fraude."),
    });

  const { mutate: mutateDeleteFraud, isPending: isPendingDeleteFraud } =
    useMutation({
      mutationFn: async () => {
        const response = await fetch(API_ROUTE.FRAUDS.DELETE_BY_SLUG(slug), {
          method: "DELETE",
        });

        if (!response.ok) {
          const result = await response.json().catch(() => null);

          throw new Error(
            result?.message ?? "Tivemos problemas ao deletar a fraude.",
          );
        }

        return response.json();
      },
      onSuccess: () => {
        toast.success("Fraude deletada com sucesso!");
        router.push(APP_ROUTE.ADMIN.DASHBOARD.ROOT);
      },
      onError: (error) =>
        toast.error(error?.message || "Tivemos problemas ao deletar a fraude."),
    });

  return (
    <>
      <DeleteButton
        onDelete={() => mutateDeleteFraud()}
        modalMessage="Tem certeza de que deseja excluir este item? Esta ação não poderá ser desfeita."
      />

      <FormFraud
        isPending={isPendingEditFraud || isPendingDeleteFraud}
        submit={(data) => mutateEditFraud(data)}
        fraud={fraud}
        allCategoriesOptions={allCategoriesOptions}
        allSubCategoriesOptions={allSubCategoriesOptions}
      />
    </>
  );
};
