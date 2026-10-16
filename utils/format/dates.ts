export const formatDateToBr = (date?: string | number | Date | null) => {
  if (!date) return "";

  return new Date(date).toLocaleDateString("pt-BR");
};
