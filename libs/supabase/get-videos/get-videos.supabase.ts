import { Video } from "@/types/global.type";
import { db } from "@/libs/supabase/server";
import { removeMimeType } from "@/utils/format/strings";
import { formatDateToBr } from "@/utils/format/dates";

interface IGetVideos {
  offset?: number;
  limit?: number;
  slug?: string;
}

export async function getVideos(params?: IGetVideos): Promise<Video[]> {
  const { offset, limit, fileId } = {
    offset: params?.offset || 0,
    limit: params?.limit || 50,
    fileId: params?.slug,
  };

  try {
    const bucket = db().storage.from("videos");

    const { data: files, error } = await bucket.list(undefined, {
      search: fileId,
      offset,
      limit: limit,
      sortBy: {
        column: "created_at",
        order: "desc",
      },
    });

    if (error) throw error;

    const videos = (files || []).reduce((acc, file) => {
      if (!file.id) return acc;

      const { data } = bucket.getPublicUrl(file.name);

      return (acc = [
        ...acc,
        {
          id: file.id,
          slug: removeMimeType(file.name),
          title: removeMimeType(file.name),
          video_url: data.publicUrl,
          created_at: formatDateToBr(file.created_at),
        },
      ]);
    }, [] as Video[]);

    return videos;
  } catch (error) {
    console.error("Erro ao buscar vídeos do Storage:", error);
    return [];
  }
}
