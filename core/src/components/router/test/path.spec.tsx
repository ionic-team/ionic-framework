import { chainToPath, generatePath, parsePath } from '../utils/path';
import { RouteChain } from '../utils/interfaces';

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


describe('chainToPath', () => {
  it('should generate a simple URL', () => {
    const chain: RouteChain = [
      { id: '2', path: [''], params: undefined },
      { id: '1', path: [''], params: undefined },
      { id: '3', path: ['segment', 'to'], params: undefined },
      { id: '4', path: [''], params: undefined },
      { id: '5', path: ['hola', '', 'hey'], params: undefined },
      { id: '6', path: [''], params: undefined },
      { id: '7', path: [':param'], params: {param: 'name'} },
      { id: '8', path: ['adios', ':name', ':id'], params: {name: 'manu', id: '123'} },
    ];
    expect(chainToPath(chain)).toEqual(
      ['segment', 'to', 'hola', 'hey', 'name', 'adios', 'manu', '123']
    );
  });

  it('should raise an exception', () => {
    const chain: RouteChain = [
      { id: '3', path: ['segment'], params: undefined },
      { id: '8', path: [':name'], params: undefined },
    ];
    expect(chainToPath(chain)).toBeNull();
  });

  it('should raise an exception 2', () => {
    const chain: RouteChain = [
      { id: '3', path: ['segment'], params: undefined },
      { id: '8', path: [':name', ':id'], params: {name: 'hey'} },
    ];
    expect(chainToPath(chain)).toBeNull();
  });
});

