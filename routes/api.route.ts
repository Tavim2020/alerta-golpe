import { addSearchParams } from "./utils/add-search-params";

const API_PREFIX = "/api";
const ADMIN_PREFIX = `${API_PREFIX}/admin`;
const FRAUDS_PREFIX = `${ADMIN_PREFIX}/frauds`;
const CATEGORIES_PREFIX = `${ADMIN_PREFIX}/categories`;
const SUB_CATEGORIES_PREFIX = `${ADMIN_PREFIX}/sub-categories`;

export const API_ROUTE = {
  ADMIN_LOGIN: `${API_PREFIX}/login`,
  ADMIN_LOG_OUT: `${API_PREFIX}/log-out`,
  FRAUDS: {
    GET: (objectWithParams: {
      page?: string | number;
      search?: string;
      limit?: string | number;
    }) => `${FRAUDS_PREFIX}/get${addSearchParams(objectWithParams)}`,
    CREATE: `${FRAUDS_PREFIX}/create`,
    UPDATE_BY_SLUG: (slug: string) => `${FRAUDS_PREFIX}/update/${slug}`,
    DELETE_BY_SLUG: (slug: string) => `${FRAUDS_PREFIX}/delete/${slug}`,
  },
  CATEGORIES: {
    CREATE: `${CATEGORIES_PREFIX}/create`,
    UPDATE_BY_ID: (id: string) => `${CATEGORIES_PREFIX}/update/${id}`,
    DELETE_BY_ID: (id: string) => `${CATEGORIES_PREFIX}/delete/${id}`,
  },
  SUB_CATEGORIES: {
    CREATE: `${SUB_CATEGORIES_PREFIX}/create`,
    UPDATE_BY_ID: (id: string) => `${SUB_CATEGORIES_PREFIX}/update/${id}`,
    DELETE_BY_ID: (id: string) => `${SUB_CATEGORIES_PREFIX}/delete/${id}`,
  },
} as const;
