import { IAutocompleteOption } from "@/components/form/controlled-autocomplete/components/autocomplete/autocomplete.type";
import { TServerDefaultResponse } from "@/types/global.type";
import { db } from "../../server";

export async function getCategoriesOptions(): Promise<
  TServerDefaultResponse<IAutocompleteOption[]>
> {
  try {
    const { data, error } = await db().from("categories").select("id, name");

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

interface IGetAllCategories {
  page?: number;
  limit: number;
  id?: string;
  search?: string;
}

export async function getAllCategories({
  page = 1,
  limit,
  id,
  search,
}: IGetAllCategories): Promise<
  TServerDefaultResponse<{ id: string; name: string }[]>
> {
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  try {
    let query = db()
      .from("categories")
      .select("id, name", { count: "exact" })
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
    console.error("Erro ao buscar as categorias:", error);
    return {
      success: false,
    };
  }
}
