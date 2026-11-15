export const formatDateToBr = (date?: string | number | Date | null) => {
  if (!date) return "";

  return new Date(date).toLocaleDateString("pt-BR");
};

export const parseLastModified = (
  value?: string | null,
): Date | undefined => {
  if (!value) return undefined;

  const brazilianDate = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value);

  if (brazilianDate) {
    const [, day, month, year] = brazilianDate;

    const date = new Date(
      Date.UTC(Number(year), Number(month) - 1, Number(day)),
    );

    if (
      date.getUTCFullYear() !== Number(year) ||
      date.getUTCMonth() !== Number(month) - 1 ||
      date.getUTCDate() !== Number(day)
    ) {
      return undefined;
    }

    return date;
  }

  // Formato ISO 8601
  const date = new Date(value);

  return Number.isNaN(date.getTime()) ? undefined : date;
};