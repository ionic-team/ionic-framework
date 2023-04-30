import { validateMaskPlaceholder, validateMaskMaxLength } from './validate';

describe('validateMaskMaxLength', () => {
  it('should return true if maxlength or mask is undefined', () => {
    expect(validateMaskMaxLength(undefined, undefined)).toBe(true);
    expect(validateMaskMaxLength(10, undefined)).toBe(true);
    expect(validateMaskMaxLength(undefined, '###')).toBe(true);
  });

  it('should return false if maxlength and mask are defined', () => {
    expect(validateMaskMaxLength(10, '###')).toBe(false);
  });
});

describe('validateMaskPlaceholder', () => {
  it('should return true if maskPlaceholder or mask is undefined', () => {
    expect(validateMaskPlaceholder(undefined, undefined)).toBe(true);
    expect(validateMaskPlaceholder('_', undefined)).toBe(true);
    expect(validateMaskPlaceholder(undefined, '###')).toBe(true);
  });

  it('should return false if maskPlaceholder and mask are defined and maskPlaceholder is not a single character or has a different length than the mask', () => {
    expect(validateMaskPlaceholder('##', '###')).toBe(false);
    expect(validateMaskPlaceholder('####', '###')).toBe(false);
  });
});
