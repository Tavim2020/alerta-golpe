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

  const { error } = await db().from("categories").delete().eq("id", id);

  if (error) throw error;

  return NextResponse.json({
    message: "Categoria deletada com sucesso!",
  });
};

export async function DELETE(req: NextRequest, params: TIdDeleteRoute) {
  return await handlerMiddleware(deleteCategory)(req, params);
}
