import { getFrauds } from "@/libs/supabase/get-videos";
import { TSlugPageParam } from "../page.type";

export const getFraudBySlug = async (params: TSlugPageParam) => {
  const { slug } = await params;
  const { data: frauds, success } = await getFrauds({ limit: 1, slug });

  if (!success)
    throw new Error("Tivemos problemas ao buscar a informação do golpe");

  const fraud = frauds?.[0];

  return { slug, fraud };
};
