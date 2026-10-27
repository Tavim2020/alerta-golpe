export const addSearchParams = (objectWithParams?: object) => {
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
