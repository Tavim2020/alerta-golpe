"use client";

import { IRenderFormEditLawyerProps } from "./render-form-edit-lawyer.type";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { APP_ROUTE } from "@/routes/app.route";
import { DeleteButton } from "@/app/admin/(security)/shared/components/delete-button/delete-button.comp";
import { API_ROUTE } from "@/routes/api.route";
import { FormLawyerSchema } from "@/app/admin/(security)/lawyers/shared/components/form-lawyer/schemas/form-lawyer.schema";
import { FormLawyer } from "@/app/admin/(security)/lawyers/shared/components/form-lawyer";

export const RenderFormEditLawyer = ({
  lawyer,
  lawyerId,
}: IRenderFormEditLawyerProps) => {
  const router = useRouter();

  const { mutate: mutateEditLawyer, isPending: isPendingEditLawyer } =
    useMutation({
      mutationFn: async (data: FormLawyerSchema) => {
        const formData = new FormData();

        Object.entries(data).forEach(([key, value]) => {
          if (value) {
            if (Array.isArray(value))
              formData.append(key, JSON.stringify(value));
            else formData.append(key, value);
          }
        });

        const response = await fetch(API_ROUTE.LAWYERS.UPDATE_BY_ID(lawyerId), {
          method: "PUT",
          body: formData,
        });

        if (!response.ok) {
          const result = await response.json().catch(() => null);

          throw new Error(
            result?.message ?? "Tivemos problemas ao editar o(a) advogado(a).",
          );
        }

        return response.json();
      },
      onSuccess: () => {
        toast.success("Advogado(a) editado(a) com sucesso!");
        router.push(APP_ROUTE.ADMIN.LAWYERS.ROOT());
      },
      onError: (error) =>
        toast.error(
          error?.message || "Tivemos problemas ao editar o(a) advogado(a).",
        ),
    });

  const { mutate: mutateDeleteLawyer, isPending: isPendingDeleteLawyer } =
    useMutation({
      mutationFn: async () => {
        const response = await fetch(API_ROUTE.LAWYERS.DELETE_BY_ID(lawyerId), {
          method: "DELETE",
        });

        if (!response.ok) {
          const result = await response.json().catch(() => null);

          throw new Error(
            result?.message ?? "Tivemos problemas ao deletar o(a) advogado(a).",
          );
        }

        return response.json();
      },
      onSuccess: () => {
        toast.success("Advogado(a) deletada com sucesso!");
        router.push(APP_ROUTE.ADMIN.LAWYERS.ROOT());
      },
      onError: (error) =>
        toast.error(
          error?.message || "Tivemos problemas ao deletar o(a) advogado(a).",
        ),
    });

  return (
    <>
      <DeleteButton
        onDelete={() => mutateDeleteLawyer()}
        modalMessage="Se deletar o(a) advogado(a) ele(a) não estará vinculado(a) em nenhuma fraude. Tem certeza de que deseja excluir este item? Esta ação não poderá ser desfeita."
      />

      <FormLawyer
        isPending={isPendingEditLawyer || isPendingDeleteLawyer}
        submit={(data) => mutateEditLawyer(data)}
        lawyer={lawyer}
      />
    </>
  );
};
