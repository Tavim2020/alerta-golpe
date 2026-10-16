export type TSlugPageParam = Promise<{ slug: string }>;

export type TVideoPageProps = {
  params: TSlugPageParam;
};
