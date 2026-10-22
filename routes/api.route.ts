import { addSearchParams } from "./utils/add-search-params";

const API_PREFIX = "/api";
const adminPrefix = `${API_PREFIX}/admin`;
const fraudsPrefix = `${adminPrefix}/frauds`;

export const API_ROUTE = {
  ADMIN_LOGIN: `${API_PREFIX}/login`,
  ADMIN_LOG_OUT: `${API_PREFIX}/log-out`,
  FRAUDS: {
    GET: (objectWithParams: {
      page?: string | number;
      search?: string;
      limit?: string | number;
    }) => `${fraudsPrefix}/get${addSearchParams(objectWithParams)}`,
    CREATE: `${fraudsPrefix}/create`,
    UPDATE_BY_SLUG: (slug: string) => `${fraudsPrefix}/update/${slug}`,
    DELETE_BY_SLUG: (slug: string) => `${fraudsPrefix}/delete/${slug}`,
  },
} as const;
