import { NextResponse, type NextRequest } from "next/server";
import { handlerMiddleware, Middleware } from "@/app/api/utils/middleware";
import { validateRequestData } from "@/app/api/utils/validators";
import { db } from "@/libs/supabase/server";
import { ConflictError, NotFoundError } from "@/utils/errors";
import { formSubCategoriesSchema } from "@/app/admin/sub-categories/shared/components/form-sub-categories/schemas/form-sub-categories.schema";

const createSubCategory: Middleware = async (req) => {
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

  const { error } = await db().from("sub_categories").insert({
    name: body.name,
    category_id: body.category,
  });

  if (error?.code === "23505")
    throw new ConflictError("Sub categoria já cadastrada");

  if (error) {
    console.error("Erro ao executar create-sub-category:", error);

    const context = (error as { context?: unknown }).context;

    if (context instanceof Response) {
      console.error("HTTP status:", context.status);
      console.error("Resposta:", await context.clone().text());
    }

    throw error;
  }

  return NextResponse.json({
    message: "Sub categoria criada com sucesso!",
  });
};

export async function POST(req: NextRequest) {
  return await handlerMiddleware(createSubCategory)(req);
}
