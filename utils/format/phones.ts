import { parsePhoneNumberFromString } from "libphonenumber-js";

export function formatPhoneDisplay(value: string) {
  if (!value) return "";

  const digits = value.replace(/\D/g, "");
  const phone = parsePhoneNumberFromString(digits, "BR");
  return phone ? phone.formatNational() : digits;
}

export function formatPhoneStorage(value: string) {
  if (!value) return "";

  return value.replace(/\D/g, "");
}
