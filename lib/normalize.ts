/**
 * Normalize Vietnamese text by removing diacritics for search purposes
 * Converts "Sửa chữa" to "sua chua" for case-insensitive matching
 */
export function normalizeText(text: string): string {
  if (!text) return "";

  return text
    .toLowerCase()
    .normalize("NFD") // Decompose characters into base + diacritics
    .replace(/[\u0300-\u036f]/g, "") // Remove diacritical marks
    .trim();
}

/**
 * Check if search term matches text without diacritics
 * Usage: searchMatch("sua chua", "Sửa chữa") => true
 */
export function searchMatch(searchTerm: string, text: string): boolean {
  const normalizedSearch = normalizeText(searchTerm);
  const normalizedText = normalizeText(text);
  return normalizedText.includes(normalizedSearch);
}
