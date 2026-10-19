const FRAUDS_ROOT = "/frauds";

const addSearchParams = (objectWithParams?: object) => {
  if (!objectWithParams) return "";

  const newSearchParams = new URLSearchParams();

  Object.entries(objectWithParams).forEach(([key, value]) => {
    if (value) {
      newSearchParams.append(key, String(value));
    }
  });

  const newValueSearchParams = newSearchParams.toString();

  return `${newValueSearchParams ? `?${newValueSearchParams}` : ""}`;
};

export const APP_ROUTE = {
  HOME: {
    ROOT: "/",
  },
  FRAUDS: {
    ROOT: (objectWithParams?: { page?: string | number; search?: string }) =>
      `${FRAUDS_ROOT}${addSearchParams(objectWithParams)}`,
    SLUG: (slug: string) => `${FRAUDS_ROOT}/${slug}`,
  },
} as const;
