import { getClassList } from '../theme';

describe('theme utils', () => {
  describe('getClassList()', () => {
    it('should parse string', () => {
      expect(getClassList(' class class-event     THEME-ios-bar-button')).toEqual([
        'class', 'class-event', 'THEME-ios-bar-button'
      ]);
      expect(getClassList('')).toEqual([]);
      expect(getClassList('  ')).toEqual([]);
    });

    it('should pass array', () => {
      expect(getClassList([
        'class', 'class-event', 'THEME-ios-bar-button'
      ])).toEqual([
        'class', 'class-event', 'THEME-ios-bar-button'
      ]);
      expect(getClassList([
        'class   ', '   class-event', '  THEME-ios-bar-button  '
      ])).toEqual([
        'class', 'class-event', 'THEME-ios-bar-button'
      ]);

      expect(getClassList([
        'class   ', null, undefined, '', '   class-event', '  THEME-ios-bar-button  '
      ] as any)).toEqual([
        'class', 'class-event', 'THEME-ios-bar-button'
      ]);
    });
  });
});
