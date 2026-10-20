import { getFrauds } from "@/libs/supabase/get-videos";
import { TSlugPageParam } from "@/types/global.type";
import { notFound } from "next/navigation";

export const getFraudBySlug = async (params: TSlugPageParam) => {
  const { slug } = await params;

  if (!slug) throw new Error("Parâmetro não encontrado!");

  const { data: frauds, success } = await getFrauds({ limit: 1, slug });

  if (!success)
    throw new Error("Tivemos problemas ao buscar a informação do golpe");

  const fraud = frauds?.[0];

  if (!fraud) return notFound();

  return { slug, fraud };
};
