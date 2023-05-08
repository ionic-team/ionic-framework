/**
 * Checks if the given character is a fixed character.
 * @param char The character to check.
 * @returns `true` if the given character is a fixed character, `false` otherwise.
 */
export function isFixedCharacter(char: RegExp | string): char is string {
  return typeof char === 'string';
}
