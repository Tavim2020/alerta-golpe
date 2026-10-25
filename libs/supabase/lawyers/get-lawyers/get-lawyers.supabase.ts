import { IAutocompleteOption } from "@/components/form/controlled-autocomplete/components/autocomplete/autocomplete.type";
import {
  IGetUniqueDefaultParam,
  ILawyer,
  TServerDefaultResponse,
} from "@/types/global.type";
import { db } from "../../server";
import { lawyersBucket } from "../../storages/supabase.storage";
import { generateBucketUrl } from "@/utils/generate/links";
import { notFound } from "next/navigation";

export async function getLawyersOptions(): Promise<
  TServerDefaultResponse<IAutocompleteOption[]>
> {
  try {
    const { data, error } = await db()
      .from("lawyers")
      .select("id, name, file_name");

    if (error) throw error;

    return {
      data: (data ?? []).map((lawyer) => {
        const { data: lawyerPhotoData } = lawyersBucket.getPublicUrl(
          lawyer.file_name,
        );

        return {
          value: lawyer.id,
          label: lawyer.name,
          photoUrl: lawyerPhotoData.publicUrl,
        };
      }),
      totalPages: 1,
      success: true,
    };
  } catch (error) {
    console.error("Erro ao buscar os advogados:", error);
    return {
      success: false,
    };
  }
}

interface IGetAllLayers {
  page?: number;
  limit: number;
  id?: string;
  search?: string;
}

export async function getAllLayers({
  page = 1,
  limit,
  id,
  search,
}: IGetAllLayers): Promise<TServerDefaultResponse<ILawyer[]>> {
  const from = (page - 1) * limit;

  try {
    const { data, error } = await db().rpc("search_lawyers", {
      p_search_term: search?.trim() || undefined,
      p_id: id || undefined,
      p_limit: limit,
      p_offset: from,
    });

    if (error) throw error;

    const total = data?.[0]?.total_count ?? 0;

    const lawyers: ILawyer[] = await Promise.all(
      (data ?? []).map(async (lawyer) => {
        const { data: lawyerPhotoData } = lawyersBucket.getPublicUrl(
          lawyer.file_name,
        );

        return {
          id: lawyer.id,
          name: lawyer.name,
          bio: lawyer.bio,
          specialty: lawyer.specialty,
          photo_url: generateBucketUrl(lawyerPhotoData.publicUrl),
        };
      }),
    );

    return {
      data: lawyers,
      totalPages: Math.ceil(Number(total) / limit),
      success: true,
    };
  } catch (error) {
    console.error("Erro ao buscar os advogados:", error);

    return {
      success: false,
    };
  }
}

export const getLawyerById = async (lawyerId: string) => {
  const { data: lawyers, success } = await getAllLayers({
    limit: 1,
    id: lawyerId,
  });

  if (!success)
    throw new Error("Tivemos problemas ao buscar a informação do advogado");

  const lawyer = lawyers?.[0];

  if (!lawyer) return notFound();

  return { lawyer };
};
