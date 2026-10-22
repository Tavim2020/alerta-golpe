import { getFrauds } from "@/libs/supabase/frauds/get-frauds";

export const getOtherRecentFrauds = async (fraudId: string) => {
  const { data: frauds, success } = await getFrauds({ limit: 4 });

  if (!success)
    throw new Error("Tivemos problemas ao buscar os vídeos mais recentes");

  return frauds.filter((other) => other.id !== fraudId).slice(0, 3);
};
