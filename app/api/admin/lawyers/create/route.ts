import { NextResponse, type NextRequest } from "next/server";
import { handlerMiddleware, Middleware } from "@/app/api/utils/middleware";
import { validateRequestData } from "@/app/api/utils/validators";
import { db } from "@/libs/supabase/server";
import { formLawyerSchema } from "@/app/admin/lawyers/shared/components/form-lawyer/schemas/form-lawyer.schema";

const createLawyer: Middleware = async (req) => {
  const body = await validateRequestData({
    schema: formLawyerSchema,
    req,
    formType: "form-data",
    fieldsKeyArray: ["specialty"],
  });

  if (!body.photo_file) throw new Error("Foto não encontrada!");

  const formData = new FormData();

  formData.append("name", body.name);
  formData.append("bio", body.bio);
  formData.append(
    "specialty",
    JSON.stringify(body.specialty.map((object) => object.content)),
  );
  formData.append("phone", body.phone);
  formData.append("instagram", body.instagram);
  formData.append("photo", body.photo_file);

  const { data, error } = await db().functions.invoke("save-lawyer", {
    body: formData,
  });

  if (error) {
    console.error("Erro ao executar save-lawyer no create:", error);

    const context = (error as { context?: unknown }).context;

    if (context instanceof Response) {
      console.error("HTTP status:", context.status);
      console.error("Resposta da Edge Function:", await context.clone().text());
    }

    throw error;
  }

  if (!data?.success)
    throw new Error(data?.error || "Não foi possível salvar o(a) advogado(a).");

  return NextResponse.json({
    message: "Advogado(a) criado(a) com sucesso!",
  });
};

export async function POST(req: NextRequest) {
  return await handlerMiddleware(createLawyer)(req);
}
