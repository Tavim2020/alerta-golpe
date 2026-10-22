"use client";

import { ButtonDefault } from "@/components/buttons/button-default";
import { IModalConfirmationProps } from "./modal-confirmation.type";

export const ModalConfirmation = ({
  isOpen,
  title = "Confirmar exclusão",
  message = "Tem certeza de que deseja excluir este item? Esta ação não poderá ser desfeita.",
  onConfirm,
  onCancel,
}: IModalConfirmationProps) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onCancel}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirmation-modal-title"
        className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <h2
          id="confirmation-modal-title"
          className="text-lg font-semibold text-gray-900"
        >
          {title}
        </h2>

        <p className="mt-3 text-sm text-gray-600">{message}</p>

        <div className="mt-6 flex justify-end gap-3">
          <ButtonDefault
            variant="clean"
            className="rounded-md border px-4 py-2"
            onClick={onCancel}
          >
            Cancelar
          </ButtonDefault>

          <ButtonDefault
            variant="clean"
            className="rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700"
            onClick={onConfirm}
          >
            Excluir
          </ButtonDefault>
        </div>
      </div>
    </div>
  );
};
