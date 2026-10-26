export function formatOnlyLetters(value: string): string {
  if (!value) return "";

  return value.replace(/[^A-Za-zÀ-ÖØ-öø-ÿ\s]/g, "");
}
