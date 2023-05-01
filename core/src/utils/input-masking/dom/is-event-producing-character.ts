/**
 * Checks if the event is a character that should be inserted into the input.
 */
export function isEventProducingCharacter({
  key,
  ctrlKey,
  metaKey,
  altKey,
}: KeyboardEvent): boolean {
  const isSystemKeyCombinations = ctrlKey || metaKey || altKey;
  const isSingleUnicodeChar = /^.$/u.test(key); // 4-byte characters case (e.g. smile)

  return !isSystemKeyCombinations && key !== 'Backspace' && isSingleUnicodeChar;
}
