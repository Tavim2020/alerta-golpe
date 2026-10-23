import { NextResponse, type NextRequest } from "next/server";
import { handlerMiddleware, Middleware } from "@/app/api/utils/middleware";
import { validateRequestData } from "@/app/api/utils/validators";
import { db } from "@/libs/supabase/server";
import { ConflictError, NotFoundError } from "@/utils/errors";
import { formSubCategoriesSchema } from "@/app/admin/(security)/sub-categories/shared/components/form-sub-categories/schemas/form-sub-categories.schema";

type TIdUpdateRoute = { params: Promise<{ id?: string }> };

const updateSubCategory: Middleware<TIdUpdateRoute> = async (
  req,
  _,
  otherProps,
) => {
  if (!otherProps) throw new Error("Parâmetro não encontrado!");

  const { id } = await otherProps?.params;

  if (!id) throw new Error("Parâmetro não encontrado!");

  const body = await validateRequestData({
    schema: formSubCategoriesSchema,
    req,
  });

  const { data: dataGetSubCategory, error: errorGetSubCategory } = await db()
    .from("sub_categories")
    .select()
    .ilike("name", body.name)
    .limit(1)
    .maybeSingle();

  if (errorGetSubCategory) throw errorGetSubCategory;

  if (dataGetSubCategory)
    throw new ConflictError("Sub categoria já cadastrada");

  const { data: dataGetCategory, error: errorGetCategory } = await db()
    .from("categories")
    .select()
    .eq("id", body.category)
    .limit(1)
    .maybeSingle();

  if (errorGetCategory) throw errorGetCategory;

  if (!dataGetCategory) throw new NotFoundError("Categoria não encontrada");

  const { error } = await db()
    .from("sub_categories")
    .update({
      name: body.name,
      category_id: body.category,
    })
    .eq("id", id);

  if (error?.code === "23505")
    throw new ConflictError("Sub categoria já cadastrada");

  if (error) throw error;

  return NextResponse.json({
    message: "Sub categoria editada com sucesso!",
  });
};

export async function PUT(req: NextRequest, params: TIdUpdateRoute) {
  return await handlerMiddleware(updateSubCategory)(req, params);
}
