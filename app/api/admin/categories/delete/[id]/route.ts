import { NextResponse, type NextRequest } from "next/server";
import { handlerMiddleware, Middleware } from "@/app/api/utils/middleware";
import { db } from "@/libs/supabase/server";

type TIdDeleteRoute = { params: Promise<{ id?: string }> };

const deleteCategory: Middleware<TIdDeleteRoute> = async (
  _,
  __,
  otherProps,
) => {
  if (!otherProps) throw new Error("Parâmetro não encontrado!");

  const { id } = await otherProps?.params;

  if (!id) throw new Error("Parâmetro não encontrado!");

  const { data: dataGetSubCategory, error: errorGetSubCategory } = await db()
    .from("sub_categories")
    .select()
    .eq("category_id", id)
    .maybeSingle();

  if (errorGetSubCategory) throw errorGetSubCategory;

  if (dataGetSubCategory)
    throw new Error(
      `Existe sub categoria vinculada com o nome: ${dataGetSubCategory.name}`,
    );

  const { error } = await db().from("categories").delete().eq("id", id);

  if (error) {
    console.error("Erro ao executar delete-category:", error);

    const context = (error as { context?: unknown }).context;

    if (context instanceof Response) {
      console.error("HTTP status:", context.status);
      console.error("Resposta:", await context.clone().text());
    }

    throw error;
  }

  return NextResponse.json({
    message: "Categoria deletada com sucesso!",
  });
};

export async function DELETE(req: NextRequest, params: TIdDeleteRoute) {
  return await handlerMiddleware(deleteCategory)(req, params);
}
