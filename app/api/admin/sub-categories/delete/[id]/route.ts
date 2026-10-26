import { NextResponse, type NextRequest } from "next/server";
import { handlerMiddleware, Middleware } from "@/app/api/utils/middleware";
import { db } from "@/libs/supabase/server";

type TIdDeleteRoute = { params: Promise<{ id?: string }> };

const deleteSubCategory: Middleware<TIdDeleteRoute> = async (
  _,
  __,
  otherProps,
) => {
  if (!otherProps) throw new Error("Parâmetro não encontrado!");

  const { id } = await otherProps?.params;

  if (!id) throw new Error("Parâmetro não encontrado!");

  const { data: dataGetFraud, error: errorGetFraud } = await db()
    .from("frauds")
    .select()
    .eq("sub_category_id", id)
    .maybeSingle();

  if (errorGetFraud) throw errorGetFraud;

  if (dataGetFraud)
    throw new Error(`Existe fraude vinculada com o slug: ${dataGetFraud.slug}`);

  const { error } = await db().from("sub_categories").delete().eq("id", id);

  if (error) throw error;

  return NextResponse.json({
    message: "Sub categoria deletada com sucesso!",
  });
};

export async function DELETE(req: NextRequest, params: TIdDeleteRoute) {
  return await handlerMiddleware(deleteSubCategory)(req, params);
}
