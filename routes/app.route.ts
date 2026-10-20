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
  LOGIN: {
    ROOT: "/login",
  },
  ADMIN: {
    DASHBOARD: {
      ROOT: `${ADMIN_PREFIX}/dashboard`,
    },
    FRAUD: {
      CREATE: `${ADMIN_PREFIX}/fraud/create`,
      EDIT: (slug: string) => `${ADMIN_PREFIX}/fraud/edit/${slug}`,
    },
    CATEGORIES: {
      ROOT: `${ADMIN_PREFIX}/categories`,
    },
    LAWYERS: {
      ROOT: `${ADMIN_PREFIX}/lawyers`,
    },
  },
} as const;
