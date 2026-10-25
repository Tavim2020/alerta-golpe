"use client";

import { FormSearch } from "@/components/search/form-search";
import { APP_ROUTE } from "@/routes/app.route";

export const WrapperLawyersFormSearch = () => {
  return (
    <FormSearch
      currentRoute={(searchValue) =>
        APP_ROUTE.ADMIN.LAWYERS.ROOT({ search: searchValue })
      }
      placeholder="Buscar por nome, bio, especialidade...."
    />
  );
};
