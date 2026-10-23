import { db } from "@/libs/supabase/server";
import { TServerDefaultResponse } from "@/types/global.type";
import { FormSubCategoriesSchema } from "@/app/admin/(security)/sub-categories/shared/components/form-sub-categories/schemas/form-sub-categories.schema";
import { NotFoundError } from "@/utils/errors";

export const getSubCategoryById = async (
  subCategoryId: string,
): Promise<TServerDefaultResponse<FormSubCategoriesSchema>> => {
  try {
    const { data, error } = await db()
      .from("sub_categories")
      .select()
      .eq("id", subCategoryId)
      .single();

    if (error) throw error;

    if (!data) throw new NotFoundError("Sub categoria não encontrada");

    return {
      success: true,
      data: {
        name: data.name,
        category: data.category_id,
      },
      totalPages: 1,
    };
  } catch (error) {
    console.error("Tivemos problemas ao buscar a sub categoria pelo id", error);

    return {
      success: false,
    };
  }
};
