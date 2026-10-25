import { IAutocompleteOption } from "@/components/form/controlled-autocomplete/components/autocomplete/autocomplete.type";
import { ISubcategory, TServerDefaultResponse } from "@/types/global.type";
import { db } from "../../server";
import { notFound } from "next/navigation";

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

interface IGetAllSubCategories {
  page?: number;
  limit: number;
  id?: string;
  search?: string;
}

export async function getAllSubCategories({
  page = 1,
  limit,
  id,
  search,
}: IGetAllSubCategories): Promise<TServerDefaultResponse<ISubcategory[]>> {
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  try {
    let query = db()
      .from("sub_categories")
      .select("id, name, category_id", { count: "exact" })
      .order("updated_at", { ascending: false });

    if (id) query = query.eq("id", id);

    if (search?.trim()) query = query.ilike("name", `%${search.trim()}%`);

    const { data, error, count } = await query.range(from, to);

    if (error) throw error;

    const total = count ?? 0;

    return {
      data: data || [],
      totalPages: Math.ceil(total / limit),
      success: true,
    };
  } catch (error) {
    console.error("Erro ao buscar as sub categorias:", error);
    return {
      success: false,
    };
  }
}

export const getSubCategoryById = async (subCategoryId: string) => {
  const { success, data } = await getAllSubCategories({
    limit: 1,
    id: subCategoryId,
  });

  if (!success) throw new Error("Tivemos problemas ao buscar a sub categoria");

  const subCategory = data?.[0];

  if (!subCategory) throw notFound();

  return { subCategory };
};
