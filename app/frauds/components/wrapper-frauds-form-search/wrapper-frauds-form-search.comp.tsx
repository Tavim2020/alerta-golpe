"use client";

import { FormSearch } from "@/components/search/form-search";
import { APP_ROUTE } from "@/routes/app.route";

export const WrapperFraudsFormSearch = () => {
  return (
    <FormSearch
      currentRoute={(searchValue) =>
        APP_ROUTE.FRAUDS.ROOT({ search: searchValue })
      }
      placeholder="Buscar por título, descrição, contexto, conteúdo, dica...."
    />
  );
};
