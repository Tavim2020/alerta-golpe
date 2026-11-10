"use client";

import { ButtonDefault } from "@/components/buttons/button-default";
import { generateShareLink } from "@/utils/generate/links";
import { IButtonShareProps } from "./button-share.type";

export const ButtonShare = ({
  fraudTitle,
  slug,
  variant,
}: IButtonShareProps) => {
  return (
    <ButtonDefault
      onClick={() => generateShareLink({ title: fraudTitle, slug, variant })}
      variant="outline"
      className="flex-1 sm:flex-none"
    >
      Outros aplicativos
    </ButtonDefault>
  );
};
