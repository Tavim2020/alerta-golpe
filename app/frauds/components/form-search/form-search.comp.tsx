"use client";

import { ButtonDefault } from "@/components/buttons/button-default";
import { ControlledInputText } from "@/components/form/controlled-input-text";
import { useForm } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import { APP_ROUTE } from "@/routes/app.route";

export const FormSearch = () => {
  const searchParams = useSearchParams();
  const searchOnUrl = searchParams.get("search") || "";

  const router = useRouter();

  const { control, handleSubmit } = useForm({
    defaultValues: {
      search: searchOnUrl,
    },
  });

  const addSearchOnUrl = (searchValue: string) =>
    router.push(APP_ROUTE.FRAUDS.ROOT({ search: searchValue }));

  const clearSearchOnUrl = () => router.push(APP_ROUTE.FRAUDS.ROOT());

  return (
    <form
      onSubmit={handleSubmit((data) => addSearchOnUrl(data.search))}
      className="my-8 flex flex-col md:flex-row md:items-center gap-4"
    >
      <ControlledInputText
        control={control}
        name="search"
        placeholder="Buscar por título, descrição, contexto, conteúdo, dica...."
        maxLength={100}
      />

      <div className="flex items-center gap-4">
        <ButtonDefault className="flex-1" type="submit">
          Buscar
        </ButtonDefault>

        {searchOnUrl && (
          <ButtonDefault
            className="flex-1"
            variant="outline"
            onClick={clearSearchOnUrl}
          >
            Limpar
          </ButtonDefault>
        )}
      </div>
    </form>
  );
};
