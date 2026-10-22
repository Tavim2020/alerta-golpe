import { IAutocompleteOption } from "@/components/form/controlled-autocomplete/components/autocomplete/autocomplete.type";
import { TServerDefaultResponse } from "@/types/global.type";
import { db } from "../../server";

export type TSubCategoriesOptions = IAutocompleteOption & {
  categoryId: string;
};

export async function getSubCategoriesOptions(): Promise<
  TServerDefaultResponse<TSubCategoriesOptions[]>
> {
  try {
    let { data, error } = await db().from("sub_categories").select(`
        id,
        name,
        category_id,
        category:categories (
          id,
          name
        )
      `);

    if (error) throw error;

    return {
      data: (data ?? []).map((subCategory) => {
        return {
          value: subCategory.id,
          label: subCategory.name,
          categoryId: subCategory.category_id,
        };
      }),
      totalPages: 1,
      success: true,
    };
  } catch (error) {
    console.error("Erro ao buscar as sub categorias:", error);
    return {
      success: false,
    };
  }
}
