import { db } from "@/libs/supabase/server";
import { TServerDefaultResponse } from "@/types/global.type";
import { FormCategoriesSchema } from "@/app/admin/(security)/categories/shared/components/form-categories/schemas/form-categories.schema";
import { NotFoundError } from "@/utils/errors";

export const getCategoryById = async (
  categoryId: string,
): Promise<TServerDefaultResponse<FormCategoriesSchema>> => {
  try {
    const { data, error } = await db()
      .from("categories")
      .select()
      .eq("id", categoryId)
      .single();

    if (error) throw error;

    if (!data) throw new NotFoundError("Categoria não encontrada");

    return {
      success: true,
      data,
      totalPages: 1,
    };
  } catch (error) {
    console.error("Tivemos problemas ao buscar a categoria pelo id", error);

    return {
      success: false,
    };
  }
};
