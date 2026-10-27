import { NextResponse, type NextRequest } from "next/server";
import { handlerMiddleware, Middleware } from "@/app/api/utils/middleware";
import { db } from "@/libs/supabase/server";

type TIdUpdateRoute = { params: Promise<{ id?: string }> };

const deleteLawyer: Middleware<TIdUpdateRoute> = async (_, __, otherProps) => {
  if (!otherProps) throw new Error("Parâmetro não encontrado!");

  const { id } = await otherProps?.params;

  if (!id) throw new Error("Parâmetro não encontrado!");

  const { data, error } = await db()
    .from("lawyers")
    .delete()
    .eq("id", id)
    .select("id")
    .maybeSingle();

  if (error) {
    console.error("Erro ao executar delete-lawyer:", error);

    const context = (error as { context?: unknown }).context;

    if (context instanceof Response) {
      console.error("HTTP status:", context.status);
      console.error("Resposta:", await context.clone().text());
    }

    throw error;
  }

  if (!data) throw new Error("Advogado(a) não encontrado(a)!");

  return NextResponse.json({
    message: "Advogado(a) deletado(a) com sucesso!",
  });
};

export async function DELETE(req: NextRequest, params: TIdUpdateRoute) {
  return await handlerMiddleware(deleteLawyer)(req, params);
}
