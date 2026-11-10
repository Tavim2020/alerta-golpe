import { EmptyVideos } from "@/components/videos/empty-videos";
import { PreviewsCards } from "@/components/previews-cards";
import { getArticles } from "@/libs/supabase/articles/get-articles/get-articles.supabase";

export const Articles = async () => {
  const { data: articles, success } = await getArticles({ limit: 3 });

  if (!success)
    throw new Error("Tivemos problemas ao buscar os últimos vídeos");

  return (
    <div className="mx-auto max-w-6xl px-4 mb-16">
      <h2 className="mb-5 font-display text-3xl">Outros Artigos</h2>

      {articles.length ? (
        <PreviewsCards previews={articles} variant="article" />
      ) : (
        <EmptyVideos />
      )}
    </div>
  );
};
