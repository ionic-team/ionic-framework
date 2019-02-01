import { ROUTER_INTENT_FORWARD } from '../utils/constants';
import { RouteChain } from '../utils/interface';
import { chainToPath, generatePath, parsePath, readPath, writePath } from '../utils/path';

describe('parseURL', () => {
  it('should parse empty path', () => {
    expect(parsePath('')).toEqual(['']);
  });

  it('should parse slash path', () => {
    expect(parsePath('/')).toEqual(['']);
    expect(parsePath(' / ')).toEqual(['']);
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

  it('should parse single segment', () => {
    expect(parsePath('path')).toEqual(['path']);
    expect(parsePath('path/')).toEqual(['path']);
    expect(parsePath('/path/')).toEqual(['path']);
    expect(parsePath('/path')).toEqual(['path']);
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
      { id: '7', path: [':param'], params: { param: 'name' } },
      { id: '8', path: ['adios', ':name', ':id'], params: { name: 'manu', id: '123' } },
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
      { id: '8', path: [':name', ':id'], params: { name: 'hey' } },
    ];
    expect(chainToPath(chain)).toBeNull();
  });
});

describe('readPath', () => {
  it('should read the URL from root (no hash)', () => {
    const loc = mockLocation('/', '');
    expect(readPath(loc, '', false)).toEqual(['']);
    expect(readPath(loc, '/', false)).toEqual(['']);
    expect(readPath(loc, '  / ', false)).toEqual(['']);

    expect(readPath(loc, '', true)).toEqual(['']);
    expect(readPath(loc, '/', true)).toEqual(['']);
    expect(readPath(loc, '  /  ', true)).toEqual(['']);
  });

  it('should read the URL from root (hash)', () => {
    const loc = mockLocation('/', '#');
    expect(readPath(loc, '', true)).toEqual(['']);
    expect(readPath(loc, '/', true)).toEqual(['']);
    expect(readPath(loc, '  /  ', true)).toEqual(['']);

    const loc2 = mockLocation('/', '#/');
    expect(readPath(loc2, '', true)).toEqual(['']);
    expect(readPath(loc2, '/', true)).toEqual(['']);
    expect(readPath(loc2, '  /  ', true)).toEqual(['']);
  });

  it('should not read the URL from root', () => {
    const loc = mockLocation('/', '');
    expect(readPath(loc, '/hola', false)).toBeNull();
    expect(readPath(loc, 'hola', false)).toBeNull();

    expect(readPath(loc, '/hola', true)).toBeNull();
    expect(readPath(loc, 'hola', true)).toBeNull();
  });

  it('should read the URL from non root (no hash)', () => {
    const loc = mockLocation('/path/to/component', '#hello');
    expect(readPath(loc, '', false)).toEqual(['path', 'to', 'component']);
    expect(readPath(loc, '/', false)).toEqual(['path', 'to', 'component']);
    expect(readPath(loc, 'path', false)).toEqual(['to', 'component']);
    expect(readPath(loc, '/path', false)).toEqual(['to', 'component']);
    expect(readPath(loc, '/path/', false)).toEqual(['to', 'component']);
    expect(readPath(loc, '/path/to', false)).toEqual(['component']);
    expect(readPath(loc, '/path/to/component', false)).toEqual(['']);
    expect(readPath(loc, '/path/to/component/', false)).toEqual(['']);
    expect(readPath(loc, '/path/to/component/path', false)).toBeNull();
  });

  it('should read the URL from non root (hash)', () => {
    const loc = mockLocation('/index.html', '#path/to/component');
    expect(readPath(loc, '', true)).toEqual(['path', 'to', 'component']);
    expect(readPath(loc, '/', true)).toEqual(['path', 'to', 'component']);
    expect(readPath(loc, 'path', true)).toEqual(['to', 'component']);
    expect(readPath(loc, '/path', true)).toEqual(['to', 'component']);
    expect(readPath(loc, '/path/', true)).toEqual(['to', 'component']);
    expect(readPath(loc, '/path/to', true)).toEqual(['component']);
    expect(readPath(loc, '/path/to/component', true)).toEqual(['']);
    expect(readPath(loc, '/path/to/component/', true)).toEqual(['']);
    expect(readPath(loc, '/path/to/component/path', true)).toBeNull();
    expect(readPath(loc, '/path/to/component2', true)).toBeNull();
  });

  it('should read the URL from non root (hash) 2', () => {
    const loc = mockLocation('/index.html', '#/path/to/component');
    expect(readPath(loc, '', true)).toEqual(['path', 'to', 'component']);
    expect(readPath(loc, '/', true)).toEqual(['path', 'to', 'component']);
    expect(readPath(loc, 'path', true)).toEqual(['to', 'component']);
    expect(readPath(loc, '/path', true)).toEqual(['to', 'component']);
    expect(readPath(loc, '/path/', true)).toEqual(['to', 'component']);
    expect(readPath(loc, '/path/to', true)).toEqual(['component']);
    expect(readPath(loc, '/path/to/component', true)).toEqual(['']);
    expect(readPath(loc, '/path/to/component/', true)).toEqual(['']);
    expect(readPath(loc, '/path/to/component/path', true)).toBeNull();
  });
});

describe('writePath', () => {
  it('should write root path (no hash)', () => {
    const history = mockHistory();
    writePath(history, '', false, [''], ROUTER_INTENT_FORWARD, 123);
    expect(history.pushState).toHaveBeenCalledWith(123, '', '/');

    writePath(history, '', false, ['schedule'], ROUTER_INTENT_FORWARD, 123);
    expect(history.pushState).toHaveBeenCalledWith(123, '', '/schedule');

    writePath(history, '/', false, [''], ROUTER_INTENT_FORWARD, 123);
    expect(history.pushState).toHaveBeenCalledWith(123, '', '/');

    writePath(history, '/', false, ['to', 'schedule'], ROUTER_INTENT_FORWARD, 123);
    expect(history.pushState).toHaveBeenCalledWith(123, '', '/to/schedule');
  });

  it('should write non root path (no hash)', () => {
    const history = mockHistory();
    writePath(history, '/path', false, [''], ROUTER_INTENT_FORWARD, 2);
    expect(history.pushState).toHaveBeenCalledWith(2, '', '/path');

    writePath(history, '/path', false, ['to', 'page'], ROUTER_INTENT_FORWARD, 2);
    expect(history.pushState).toHaveBeenCalledWith(2, '', '/path/to/page');

    writePath(history, 'path/to', false, ['second', 'page'], ROUTER_INTENT_FORWARD, 2);
    expect(history.pushState).toHaveBeenCalledWith(2, '', '/path/to/second/page');

    writePath(history, '/path/to/', false, ['second', 'page'], ROUTER_INTENT_FORWARD, 2);
    expect(history.pushState).toHaveBeenCalledWith(2, '', '/path/to/second/page');
  });

  it('should write root path (no hash)', () => {
    const history = mockHistory();
    writePath(history, '', true, [''], ROUTER_INTENT_FORWARD, 123);
    expect(history.pushState).toHaveBeenCalledWith(123, '', '#/');

    writePath(history, '', true, ['schedule'], ROUTER_INTENT_FORWARD, 123);
    expect(history.pushState).toHaveBeenCalledWith(123, '', '#/schedule');

    writePath(history, '/', true, [''], ROUTER_INTENT_FORWARD, 123);
    expect(history.pushState).toHaveBeenCalledWith(123, '', '#/');

    writePath(history, '/', true, ['to', 'schedule'], ROUTER_INTENT_FORWARD, 123);
    expect(history.pushState).toHaveBeenCalledWith(123, '', '#/to/schedule');
  });

  it('should write non root path (no hash)', () => {
    const history = mockHistory();
    writePath(history, '/path', true, [''], ROUTER_INTENT_FORWARD, 123);
    expect(history.pushState).toHaveBeenCalledWith(123, '', '#/path');

    writePath(history, '/path', true, ['to', 'page'], ROUTER_INTENT_FORWARD, 123);
    expect(history.pushState).toHaveBeenCalledWith(123, '', '#/path/to/page');

    writePath(history, 'path/to', true, ['second', 'page'], ROUTER_INTENT_FORWARD, 123);
    expect(history.pushState).toHaveBeenCalledWith(123, '', '#/path/to/second/page');

    writePath(history, '/path/to/', true, ['second', 'page'], ROUTER_INTENT_FORWARD, 123);
    expect(history.pushState).toHaveBeenCalledWith(123, '', '#/path/to/second/page');
  });
});

function mockHistory(): History {
  return {
    replaceState: jest.fn(),
    pushState: jest.fn(),
    length: 0,
  } as any;
}

function mockLocation(pathname: string, hash: string): Location {
  return {
    pathname,
    hash
  } as Location;
}
