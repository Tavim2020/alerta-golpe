import { NextResponse, type NextRequest } from "next/server";
import { handlerMiddleware, Middleware } from "@/app/api/utils/middleware";
import { validateRequestData } from "@/app/api/utils/validators";
import { formFraudSchema } from "@/app/admin/fraud/shared/components/form-fraud/schemas/form-fraud.schema";
import { db } from "@/libs/supabase/server";

type TSlugUpdateRoute = { params: Promise<{ slug?: string }> };

const deleteFraud: Middleware<TSlugUpdateRoute> = async (
  req,
  _,
  otherProps,
) => {
  if (!otherProps) throw new Error("Parâmetro não encontrado!");

  const { slug } = await otherProps?.params;

  if (!slug) throw new Error("Parâmetro não encontrado!");

  const { data, error } = await db()
    .from("frauds")
    .delete()
    .eq("slug", slug)
    .select("id")
    .maybeSingle();

  if (error) throw error;

  if (!data) throw new Error("Fraude não encontrada!");

  return NextResponse.json({
    message: "Fraude deletada com sucesso!",
  });
};

export async function DELETE(req: NextRequest, params: TSlugUpdateRoute) {
  return await handlerMiddleware(deleteFraud)(req, params);
}
