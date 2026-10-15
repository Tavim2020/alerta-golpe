const FRAUDS_ROOT = "/frauds";

export const APP_ROUTE = {
  HOME: {
    ROOT: "/",
  },
  FRAUDS: {
    ROOT: FRAUDS_ROOT,
    SLUG: (slug: string) => `${FRAUDS_ROOT}/${slug}`,
  },
} as const;
