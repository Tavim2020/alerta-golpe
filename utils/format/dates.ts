export const formatDateToBr = (date?: string | number | Date | null) => {
  if (!date) return "";

  console.log("oi");

  return new Date(date).toLocaleDateString("pt-BR");
};
