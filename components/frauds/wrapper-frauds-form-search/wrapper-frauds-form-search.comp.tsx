"use client";

import { FormSearch } from "@/components/search/form-search";
import { wrapperFraudsConstants } from "./constants/wrapper-frauds-form-search.constant";
import { IWrapperFraudsFormSearchProps } from "./wrapper-frauds-form-search.type";

export const WrapperFraudsFormSearch = ({
  page,
}: IWrapperFraudsFormSearchProps) => {
  const currentRoute = wrapperFraudsConstants[page];

  return (
    <FormSearch
      currentRoute={currentRoute}
      placeholder="Buscar por título, descrição, contexto, conteúdo, dica...."
    />
  );
};
