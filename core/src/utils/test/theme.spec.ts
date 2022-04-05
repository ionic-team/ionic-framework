import { getClassList, getClassMap } from '../theme';

describe('getClassList()', () => {
  it('should parse string', () => {
    expect(getClassList(' class class-event     THEME-ios-bar-button')).toEqual([
      'class',
      'class-event',
      'THEME-ios-bar-button',
    ]);
    expect(getClassList('')).toEqual([]);
    expect(getClassList('  ')).toEqual([]);
  });

  it('should pass array', () => {
    expect(getClassList(['class', 'class-event', 'THEME-ios-bar-button'])).toEqual([
      'class',
      'class-event',
      'THEME-ios-bar-button',
    ]);
    expect(getClassList(['class   ', '   class-event', '  THEME-ios-bar-button  '])).toEqual([
      'class',
      'class-event',
      'THEME-ios-bar-button',
    ]);

    expect(
      getClassList(['class   ', null, undefined, '', '   class-event', '  ', '  THEME-ios-bar-button  '] as any)
    ).toEqual(['class', 'class-event', 'THEME-ios-bar-button']);
  });
});

describe('getClassMap()', () => {
  it('should parse string', () => {
    expect(getClassMap(' class class-event     THEME-ios-bar-button')).toEqual({
      class: true,
      'class-event': true,
      'THEME-ios-bar-button': true,
    });
    expect(getClassMap('')).toEqual({});
    expect(getClassMap('  ')).toEqual({});
  });

  it('should pass array', () => {
    expect(getClassMap(['class', 'class-event', 'THEME-ios-bar-button'])).toEqual({
      class: true,
      'class-event': true,
      'THEME-ios-bar-button': true,
    });

    expect(getClassMap(['class   ', '   class-event', '  THEME-ios-bar-button  '])).toEqual({
      class: true,
      'class-event': true,
      'THEME-ios-bar-button': true,
    });

    expect(
      getClassMap(['class   ', null, undefined, '', '   class-event', '  ', '  THEME-ios-bar-button  '] as any)
    ).toEqual({
      class: true,
      'class-event': true,
      'THEME-ios-bar-button': true,
    });
  });
});
