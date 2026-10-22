import { IAutocompleteOption } from "@/components/form/controlled-autocomplete/components/autocomplete/autocomplete.type";
import { TServerDefaultResponse } from "@/types/global.type";
import { db } from "../../server";

export async function getCategoriesOptions(): Promise<
  TServerDefaultResponse<IAutocompleteOption[]>
> {
  try {
    let { data, error } = await db().from("categories").select("id, name");

    if (error) throw error;

    return {
      data: (data ?? []).map((category) => {
        return {
          value: category.id,
          label: category.name,
        };
      }),
      totalPages: 1,
      success: true,
    };
  } catch (error) {
    console.error("Erro ao buscar as categorias:", error);
    return {
      success: false,
    };
  }
}
