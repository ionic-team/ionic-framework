import { formatMask } from './format';

describe('formatMask', () => {
  it('should convert a string to a RegExp', () => {
    const mask = formatMask('0');
    expect(mask).toBeInstanceOf(RegExp);
  });

  it('should return the mask if it is already an array', () => {
    const mask = formatMask([/\d/, /\d/]);
    expect(mask).toEqual([/\d/, /\d/]);
  });

  it('should return null if the mask is not a string or array', () => {
    const mask = formatMask(null as any);
    expect(mask).toBeNull();
  });
});
