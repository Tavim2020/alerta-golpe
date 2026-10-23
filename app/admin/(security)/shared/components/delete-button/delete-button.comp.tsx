"use client";

import { ButtonDefault } from "@/components/buttons/button-default";
import { Trash } from "lucide-react";
import { useState } from "react";
import { ModalConfirmation } from "./components/modal-confirmation";
import { IDeleteButtonProps } from "./delete-button.type";

export const DeleteButton = ({
  modalMessage,
  onDelete,
}: IDeleteButtonProps) => {
  const [openModalConfirmation, setOpenModalConfirmation] = useState(false);

  const handleConfirm = () => {
    onDelete();
    setOpenModalConfirmation(false);
  };

  return (
    <>
      <div className="flex justify-end">
        <ButtonDefault
          variant="clean"
          className="border p-1"
          onClick={() => setOpenModalConfirmation(true)}
        >
          <Trash className="w-8 h-8" />
        </ButtonDefault>
      </div>

      <ModalConfirmation
        isOpen={openModalConfirmation}
        onCancel={() => setOpenModalConfirmation(false)}
        onConfirm={handleConfirm}
        message={modalMessage}
      />
    </>
  );
};
