import { isRTL } from './dir';

describe('rtl: dir', () => {
  describe('with host element', () => {
    it('should return true', () => {
      expect(isRTL({ dir: 'rtl' })).toBe(true);
    });

    it('should return false', () => {
      expect(isRTL({ dir: 'ltr' })).toBe(false);
      expect(isRTL({ dir: '' })).toBe(false);
    });
  });

  describe('without host element', () => {
    it('should return true', () => {
      global.document.dir = 'rtl';
      expect(isRTL()).toBe(true);
      expect(isRTL({ dir: undefined } as any)).toBe(true);
    });

    it('should return false', () => {
      global.document.dir = 'ltr';
      expect(isRTL()).toBe(false);
      expect(isRTL({ dir: undefined } as any)).toBe(false);

      global.document = undefined as any;
      expect(isRTL()).toBe(false);
    });
  });
});
