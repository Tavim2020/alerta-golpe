import { NextResponse, type NextRequest } from "next/server";
import { handlerMiddleware, Middleware } from "@/app/api/utils/middleware";
import { validateRequestData } from "@/app/api/utils/validators";
import { formFraudSchema } from "@/app/admin/fraud/shared/components/form-fraud/schemas/form-fraud.schema";
import { db } from "@/libs/supabase/server";

type TSlugUpdateRoute = { params: Promise<{ slug?: string }> };

const updateFraud: Middleware<TSlugUpdateRoute> = async (
  req,
  _,
  otherProps,
) => {
  if (!otherProps) throw new Error("Parâmetro não encontrado!");

  const { slug } = await otherProps?.params;

  if (!slug) throw new Error("Parâmetro não encontrado!");

  const body = await validateRequestData({
    schema: formFraudSchema,
    req,
    formType: "form-data",
    fieldsKeyArray: ["tips"],
  });

  if (!body.video_file) throw new Error("Vídeo não encontrado!");
  if (!body.thumbnail_file) throw new Error("Imagem não encontrada!");

  const formData = new FormData();

  formData.append("slug", slug);
  formData.append("title", body.title);
  formData.append("description", body.description);
  formData.append("context", body.context);
  formData.append("content", body.content);
  formData.append("tips", JSON.stringify(body.tips));
  formData.append("sub_category_id", body.sub_category);

  formData.append("video", body.video_file);
  formData.append("thumbnail", body.thumbnail_file);

  const { error } = await db().functions.invoke("save-fraud", {
    body: formData,
  });

  if (error) throw error;

  return NextResponse.json({
    message: "Fraude editada com sucesso!",
  });
};

export async function PUT(req: NextRequest, params: TSlugUpdateRoute) {
  return await handlerMiddleware(updateFraud)(req, params);
}
