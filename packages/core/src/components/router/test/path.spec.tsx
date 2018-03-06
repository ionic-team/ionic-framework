import { generatePath, parsePath } from '../utils/path';

describe('parseURL', () => {
  it('should parse empty path', () => {
    expect(parsePath('')).toEqual(['']);
  });

  it('should parse empty path (2)', () => {
    expect(parsePath('   ')).toEqual(['']);
  });

  it('should parse null path', () => {
    expect(parsePath(null)).toEqual(['']);
  });

  it('should parse undefined path', () => {
    expect(parsePath(undefined)).toEqual(['']);
  });

  it('should parse relative path', () => {
    expect(parsePath('path/to/file.js')).toEqual(['path', 'to', 'file.js']);
  });

  it('should parse absolute path', () => {
    expect(parsePath('/path/to/file.js')).toEqual(['path', 'to', 'file.js']);
  });
  it('should parse relative path', () => {
    expect(parsePath('/PATH///to//file.js//')).toEqual(['PATH', 'to', 'file.js']);
  });
});


describe('generatePath', () => {
  it('should generate an empty URL', () => {
    expect(generatePath([])).toEqual('/');
    expect(generatePath([{ path: '' } as any])).toEqual('/');
    expect(generatePath([{ path: '/' } as any])).toEqual('/');
    expect(generatePath([{ path: '//' } as any])).toEqual('/');
    expect(generatePath([{ path: '  ' } as any])).toEqual('/');
  });

  it('should genenerate a basic url', () => {
    const stack = [
      '',
      '',
      '',
      'path/to',
      'page',
      'number-TWO',
      ''
    ];
    expect(generatePath(stack)).toEqual('/path/to/page/number-TWO');

  });
});
