import { formatMask } from './format-mask';

describe('formatMask', () => {
  it('should return a RegExp if the given mask is a string', () => {
    expect(formatMask('a')).toBeInstanceOf(RegExp);
    expect(formatMask('a')).toEqual(/a/);
  });

  it('should return null if the given mask is an invalid regular expression', () => {
    const originalError = console.error;
    console.error = jest.fn();

    expect(formatMask('[')).toBeNull();

    console.error = originalError;
  });
});
