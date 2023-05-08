import { isFixedCharacter } from './is-fixed-character';

describe('isFixedCharacter()', () => {
  it('should return true if the given character is a string', () => {
    expect(isFixedCharacter('a')).toBe(true);
  });

  it('should return false if the given character is a RegExp', () => {
    expect(isFixedCharacter(/[a-z]/)).toBe(false);
  });
});
