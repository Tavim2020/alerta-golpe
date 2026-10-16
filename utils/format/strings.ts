export const removeMimeType = (value?: string | null) => {
  if (!value) return "";

  return value.replace(/\.[^/.]+$/, "");
};
