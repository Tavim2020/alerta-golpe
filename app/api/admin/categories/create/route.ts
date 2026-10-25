import { NextResponse, type NextRequest } from "next/server";
import { handlerMiddleware, Middleware } from "@/app/api/utils/middleware";
import { validateRequestData } from "@/app/api/utils/validators";
import { db } from "@/libs/supabase/server";
import { formCategoriesSchema } from "@/app/admin/categories/shared/components/form-categories/schemas/form-categories.schema";
import { ConflictError } from "@/utils/errors";

const createCategory: Middleware = async (req) => {
  const body = await validateRequestData({
    schema: formCategoriesSchema,
    req,
  });

  const { data, error: errorGetCategory } = await db()
    .from("categories")
    .select()
    .ilike("name", body.name)
    .limit(1)
    .maybeSingle();

  if (errorGetCategory) throw errorGetCategory;

  if (data) throw new ConflictError("Categoria já cadastrada");

  const { error } = await db().from("categories").insert({
    name: body.name,
  });

  if (error?.code === "23505")
    throw new ConflictError("Categoria já cadastrada");

  if (error) throw error;

  return NextResponse.json({
    message: "Categoria criada com sucesso!",
  });
};

export async function POST(req: NextRequest) {
  return await handlerMiddleware(createCategory)(req);
}
