import { addSearchParams } from "./utils/add-search-params";

const FRAUDS_ROOT = "/frauds";
const ADMIN_PREFIX = "/admin";
const ADMIN_FRAUD_PREFIX = `${ADMIN_PREFIX}/fraud`;
const ADMIN_CATEGORIES_ROOT = `${ADMIN_PREFIX}/categories`;
const ADMIN_SUB_CATEGORIES_ROOT = `${ADMIN_PREFIX}/sub-categories`;
const ADMIN_LAWYERS_ROOT = `${ADMIN_PREFIX}/lawyers`;

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
      CREATE: `${ADMIN_FRAUD_PREFIX}/create`,
      EDIT: (slug: string) => `${ADMIN_FRAUD_PREFIX}/edit/${slug}`,
    },
    CATEGORIES: {
      ROOT: (objectWithParams?: { page?: string | number; search?: string }) =>
        `${ADMIN_CATEGORIES_ROOT}${addSearchParams(objectWithParams)}`,
      CREATE: `${ADMIN_CATEGORIES_ROOT}/create`,
      EDIT: (id: string) => `${ADMIN_CATEGORIES_ROOT}/edit/${id}`,
    },
    LAWYERS: {
      ROOT: (objectWithParams?: { page?: string | number; search?: string }) =>
        `${ADMIN_LAWYERS_ROOT}${addSearchParams(objectWithParams)}`,
      CREATE: `${ADMIN_LAWYERS_ROOT}/create`,
      EDIT: (id: string) => `${ADMIN_LAWYERS_ROOT}/edit/${id}`,
    },
    SUB_CATEGORIES: {
      ROOT: (objectWithParams?: { page?: string | number; search?: string }) =>
        `${ADMIN_SUB_CATEGORIES_ROOT}${addSearchParams(objectWithParams)}`,
      CREATE: `${ADMIN_SUB_CATEGORIES_ROOT}/create`,
      EDIT: (id: string) => `${ADMIN_SUB_CATEGORIES_ROOT}/edit/${id}`,
    },
  },
} as const;
