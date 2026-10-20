import { addSearchParams } from "./utils/add-search-params";

const FRAUDS_ROOT = "/frauds";
const ADMIN_PREFIX = "/admin";

export const APP_ROUTE = {
  HOME: {
    ROOT: "/",
  },
  FRAUDS: {
    ROOT: (objectWithParams?: { page?: string | number; search?: string }) =>
      `${FRAUDS_ROOT}${addSearchParams(objectWithParams)}`,
    SLUG: (slug: string) => `${FRAUDS_ROOT}/${slug}`,
  },
  ADMIN: {
    LOGIN: `${ADMIN_PREFIX}/login`,
    DASHBOARD: `${ADMIN_PREFIX}/dashboard`,
  },
} as const;
