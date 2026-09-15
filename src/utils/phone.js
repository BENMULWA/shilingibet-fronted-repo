export function normalizeKenyanPhone(input = "") {
  const digits = String(input).replace(/\D/g, "");

  if ((digits.startsWith("2547") || digits.startsWith("2541")) && digits.length === 12) {
    return digits;
  }

  if ((digits.startsWith("7") || digits.startsWith("1")) && digits.length === 9) {
    return `254${digits}`;
  }

  if ((digits.startsWith("07") || digits.startsWith("01")) && digits.length === 10) {
    return `254${digits.slice(1)}`;
  }

  return String(input).trim();
}
