"use client";

import { FormSearch } from "@/components/search/form-search";
import { APP_ROUTE } from "@/routes/app.route";

export const WrapperCategoriesFormSearch = () => {
  return (
    <FormSearch
      currentRoute={(searchValue) =>
        APP_ROUTE.ADMIN.CATEGORIES.ROOT({ search: searchValue })
      }
      placeholder="Buscar por nome...."
    />
  );
};
