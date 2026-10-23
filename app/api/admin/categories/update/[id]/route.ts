import { NextResponse, type NextRequest } from "next/server";
import { handlerMiddleware, Middleware } from "@/app/api/utils/middleware";
import { validateRequestData } from "@/app/api/utils/validators";
import { db } from "@/libs/supabase/server";
import { formCategoriesSchema } from "@/app/admin/(security)/categories/shared/components/form-categories/schemas/form-categories.schema";
import { ConflictError } from "@/utils/errors";

type TIdUpdateRoute = { params: Promise<{ id?: string }> };

const updateCategory: Middleware<TIdUpdateRoute> = async (
  req,
  _,
  otherProps,
) => {
  if (!otherProps) throw new Error("Parâmetro não encontrado!");

  const { id } = await otherProps?.params;

  if (!id) throw new Error("Parâmetro não encontrado!");

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

  const { error } = await db()
    .from("categories")
    .update({
      name: body.name,
    })
    .eq("id", id);

  if (error?.code === "23505")
    throw new ConflictError("Categoria já cadastrada");

  if (error) throw error;

  return NextResponse.json({
    message: "Categoria editada com sucesso!",
  });
};

export async function PUT(req: NextRequest, params: TIdUpdateRoute) {
  return await handlerMiddleware(updateCategory)(req, params);
}
