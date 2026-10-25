"use client";

import { FormSearch } from "@/components/search/form-search";
import { APP_ROUTE } from "@/routes/app.route";

export const WrapperSubCategoriesFormSearch = () => {
  return (
    <FormSearch
      currentRoute={(searchValue) =>
        APP_ROUTE.ADMIN.SUB_CATEGORIES.ROOT({ search: searchValue })
      }
      placeholder="Buscar por nome...."
    />
  );
};
