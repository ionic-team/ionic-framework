import { ROUTER_INTENT_FORWARD } from '../utils/constants';
import type { RouteChain } from '../utils/interface';
import { chainToSegments, generatePath, parsePath, readSegments, writeSegments } from '../utils/path';

describe('parsePath', () => {
  it('should parse empty path', () => {
    expect(parsePath('').segments).toEqual(['']);
  });

  it('should parse slash path', () => {
    expect(parsePath('/').segments).toEqual(['']);
    expect(parsePath(' / ').segments).toEqual(['']);
  });

  it('should parse empty path (2)', () => {
    expect(parsePath('   ').segments).toEqual(['']);
  });

  it('should parse null path', () => {
    expect(parsePath(null).segments).toEqual(['']);
  });

  it('should parse undefined path', () => {
    expect(parsePath(undefined).segments).toEqual(['']);
  });

  it('should parse single segment', () => {
    expect(parsePath('path').segments).toEqual(['path']);
    expect(parsePath('path/').segments).toEqual(['path']);
    expect(parsePath('/path/').segments).toEqual(['path']);
    expect(parsePath('/path').segments).toEqual(['path']);
  });

  it('should parse relative path', () => {
    expect(parsePath('path/to/file.js').segments).toEqual(['path', 'to', 'file.js']);
  });

  it('should parse absolute path', () => {
    expect(parsePath('/path/to/file.js').segments).toEqual(['path', 'to', 'file.js']);
  });
  it('should parse absolute path with multiple slashes', () => {
    expect(parsePath('/PATH///to//file.js//').segments).toEqual(['PATH', 'to', 'file.js']);
  });

  it('should parse query string', () => {
    expect(parsePath(null).queryString).toBe(undefined);
    expect(parsePath('path/to/file.js').queryString).toBe(undefined);
    expect(parsePath('path/to/file.js?').queryString).toEqual('');
    expect(parsePath('path/to/file.js?a=b').queryString).toEqual('a=b');
  });

  it('should strip the fragment from segments and return it', () => {
    const result = parsePath('/catalog#pens');
    expect(result.segments).toEqual(['catalog']);
    expect(result.fragment).toEqual('pens');
  });

  it('should parse fragment alongside query string (query first)', () => {
    const result = parsePath('/catalog?x=1#pens');
    expect(result.segments).toEqual(['catalog']);
    expect(result.queryString).toEqual('x=1');
    expect(result.fragment).toEqual('pens');
  });

  it('should treat "?" inside fragment as part of the fragment', () => {
    // Per RFC 3986 the fragment starts at the first "#" and runs to the end.
    const result = parsePath('/catalog#pens?x=1');
    expect(result.segments).toEqual(['catalog']);
    expect(result.queryString).toBeUndefined();
    expect(result.fragment).toEqual('pens?x=1');
  });

  it('should parse fragment-only path', () => {
    const result = parsePath('#pens');
    expect(result.segments).toEqual(['']);
    expect(result.fragment).toEqual('pens');
  });

  it('should leave fragment undefined when there is no "#"', () => {
    expect(parsePath('/catalog').fragment).toBeUndefined();
    expect(parsePath('/catalog?x=1').fragment).toBeUndefined();
    expect(parsePath(null).fragment).toBeUndefined();
    expect(parsePath(undefined).fragment).toBeUndefined();
  });

  it('should preserve percent-encoded characters in the fragment', () => {
    // parsePath keeps the fragment in its URL-encoded form; decoding for id
    // matching is the consumer's responsibility (see `scrollToFragment`).
    expect(parsePath('/catalog#sec%20one').fragment).toEqual('sec%20one');
    expect(parsePath('/catalog#%E4%B8%AD%E6%96%87').fragment).toEqual('%E4%B8%AD%E6%96%87');
  });
});

describe('generatePath', () => {
  it('should generate an empty URL', () => {
    expect(generatePath([])).toEqual('/');
    expect(generatePath([{ segments: '' } as any])).toEqual('/');
    expect(generatePath([{ segments: '/' } as any])).toEqual('/');
    expect(generatePath([{ segments: '//' } as any])).toEqual('/');
    expect(generatePath([{ segments: '  ' } as any])).toEqual('/');
  });

  it('should genenerate a basic url', () => {
    const stack = ['', '', '', 'path/to', 'page', 'number-TWO', ''];
    expect(generatePath(stack)).toEqual('/path/to/page/number-TWO');
  });
});

describe('chainToSegments', () => {
  it('should generate a simple URL', () => {
    const chain: RouteChain = [
      { id: '2', segments: [''], params: undefined },
      { id: '1', segments: [''], params: undefined },
      { id: '3', segments: ['segment', 'to'], params: undefined },
      { id: '4', segments: [''], params: undefined },
      { id: '5', segments: ['hola', '', 'hey'], params: undefined },
      { id: '6', segments: [''], params: undefined },
      { id: '7', segments: [':param'], params: { param: 'name' } },
      { id: '8', segments: ['adios', ':name', ':id'], params: { name: 'manu', id: '123' } },
    ];
    expect(chainToSegments(chain)).toEqual(['segment', 'to', 'hola', 'hey', 'name', 'adios', 'manu', '123']);
  });

  it('should return null on missing parameters', () => {
    const chain: RouteChain = [
      { id: '3', segments: ['segment'], params: undefined },
      { id: '8', segments: [':name'], params: undefined },
    ];
    expect(chainToSegments(chain)).toBeNull();
  });

  it('should return null on missing parameters 2', () => {
    const chain: RouteChain = [
      { id: '3', segments: ['segment'], params: undefined },
      { id: '8', segments: [':name', ':id'], params: { name: 'hey' } },
    ];
    expect(chainToSegments(chain)).toBeNull();
  });
});

describe('readSegments', () => {
  it('should read the URL from root (no hash)', () => {
    const loc = mockLocation('/', '');
    expect(readSegments(loc, '', false)).toEqual(['']);
    expect(readSegments(loc, '/', false)).toEqual(['']);
    expect(readSegments(loc, '  / ', false)).toEqual(['']);

    expect(readSegments(loc, '', true)).toEqual(['']);
    expect(readSegments(loc, '/', true)).toEqual(['']);
    expect(readSegments(loc, '  /  ', true)).toEqual(['']);
  });

  it('should read the URL from root (hash)', () => {
    const loc = mockLocation('/', '#');
    expect(readSegments(loc, '', true)).toEqual(['']);
    expect(readSegments(loc, '/', true)).toEqual(['']);
    expect(readSegments(loc, '  /  ', true)).toEqual(['']);

    const loc2 = mockLocation('/', '#/');
    expect(readSegments(loc2, '', true)).toEqual(['']);
    expect(readSegments(loc2, '/', true)).toEqual(['']);
    expect(readSegments(loc2, '  /  ', true)).toEqual(['']);
  });

  it('should not read the URL from root', () => {
    const loc = mockLocation('/', '');
    expect(readSegments(loc, '/hola', false)).toBeNull();
    expect(readSegments(loc, 'hola', false)).toBeNull();

    expect(readSegments(loc, '/hola', true)).toBeNull();
    expect(readSegments(loc, 'hola', true)).toBeNull();
  });

  it('should read the URL from non root (no hash)', () => {
    const loc = mockLocation('/path/to/component', '#hello');
    expect(readSegments(loc, '', false)).toEqual(['path', 'to', 'component']);
    expect(readSegments(loc, '/', false)).toEqual(['path', 'to', 'component']);
    expect(readSegments(loc, 'path', false)).toEqual(['to', 'component']);
    expect(readSegments(loc, '/path', false)).toEqual(['to', 'component']);
    expect(readSegments(loc, '/path/', false)).toEqual(['to', 'component']);
    expect(readSegments(loc, '/path/to', false)).toEqual(['component']);
    expect(readSegments(loc, '/path/to/component', false)).toEqual(['']);
    expect(readSegments(loc, '/path/to/component/', false)).toEqual(['']);
    expect(readSegments(loc, '/path/to/component/path', false)).toBeNull();
  });

  it('should read the URL from non root (hash)', () => {
    const loc = mockLocation('/index.html', '#path/to/component');
    expect(readSegments(loc, '', true)).toEqual(['path', 'to', 'component']);
    expect(readSegments(loc, '/', true)).toEqual(['path', 'to', 'component']);
    expect(readSegments(loc, 'path', true)).toEqual(['to', 'component']);
    expect(readSegments(loc, '/path', true)).toEqual(['to', 'component']);
    expect(readSegments(loc, '/path/', true)).toEqual(['to', 'component']);
    expect(readSegments(loc, '/path/to', true)).toEqual(['component']);
    expect(readSegments(loc, '/path/to/component', true)).toEqual(['']);
    expect(readSegments(loc, '/path/to/component/', true)).toEqual(['']);
    expect(readSegments(loc, '/path/to/component/path', true)).toBeNull();
    expect(readSegments(loc, '/path/to/component2', true)).toBeNull();
  });

  it('should read the URL from non root (hash) 2', () => {
    const loc = mockLocation('/index.html', '#/path/to/component');
    expect(readSegments(loc, '', true)).toEqual(['path', 'to', 'component']);
    expect(readSegments(loc, '/', true)).toEqual(['path', 'to', 'component']);
    expect(readSegments(loc, 'path', true)).toEqual(['to', 'component']);
    expect(readSegments(loc, '/path', true)).toEqual(['to', 'component']);
    expect(readSegments(loc, '/path/', true)).toEqual(['to', 'component']);
    expect(readSegments(loc, '/path/to', true)).toEqual(['component']);
    expect(readSegments(loc, '/path/to/component', true)).toEqual(['']);
    expect(readSegments(loc, '/path/to/component/', true)).toEqual(['']);
    expect(readSegments(loc, '/path/to/component/path', true)).toBeNull();
  });
});

describe('writeSegments', () => {
  it('should write root path (no hash)', () => {
    const history = mockHistory();
    writeSegments(history, '', false, [''], ROUTER_INTENT_FORWARD, 123);
    expect(history.pushState).toHaveBeenCalledWith(123, '', '/');

    writeSegments(history, '', false, ['schedule'], ROUTER_INTENT_FORWARD, 123);
    expect(history.pushState).toHaveBeenCalledWith(123, '', '/schedule');

    writeSegments(history, '/', false, [''], ROUTER_INTENT_FORWARD, 123);
    expect(history.pushState).toHaveBeenCalledWith(123, '', '/');

    writeSegments(history, '/', false, ['to', 'schedule'], ROUTER_INTENT_FORWARD, 123);
    expect(history.pushState).toHaveBeenCalledWith(123, '', '/to/schedule');

    writeSegments(history, '/', false, ['to', 'schedule'], ROUTER_INTENT_FORWARD, 123, 'flag=true');
    expect(history.pushState).toHaveBeenCalledWith(123, '', '/to/schedule?flag=true');
  });

  it('should write non root path (no hash)', () => {
    const history = mockHistory();
    writeSegments(history, '/path', false, [''], ROUTER_INTENT_FORWARD, 2);
    expect(history.pushState).toHaveBeenCalledWith(2, '', '/path');

    writeSegments(history, '/path', false, ['to', 'page'], ROUTER_INTENT_FORWARD, 2);
    expect(history.pushState).toHaveBeenCalledWith(2, '', '/path/to/page');

    writeSegments(history, 'path/to', false, ['second', 'page'], ROUTER_INTENT_FORWARD, 2);
    expect(history.pushState).toHaveBeenCalledWith(2, '', '/path/to/second/page');

    writeSegments(history, '/path/to/', false, ['second', 'page'], ROUTER_INTENT_FORWARD, 2);
    expect(history.pushState).toHaveBeenCalledWith(2, '', '/path/to/second/page');

    writeSegments(history, '/path/to/', false, ['second', 'page'], ROUTER_INTENT_FORWARD, 2, 'flag=true');
    expect(history.pushState).toHaveBeenCalledWith(2, '', '/path/to/second/page?flag=true');
  });

  it('should write root path (no hash)', () => {
    const history = mockHistory();
    writeSegments(history, '', true, [''], ROUTER_INTENT_FORWARD, 123);
    expect(history.pushState).toHaveBeenCalledWith(123, '', '#/');

    writeSegments(history, '', true, ['schedule'], ROUTER_INTENT_FORWARD, 123);
    expect(history.pushState).toHaveBeenCalledWith(123, '', '#/schedule');

    writeSegments(history, '/', true, [''], ROUTER_INTENT_FORWARD, 123);
    expect(history.pushState).toHaveBeenCalledWith(123, '', '#/');

    writeSegments(history, '/', true, ['to', 'schedule'], ROUTER_INTENT_FORWARD, 123);
    expect(history.pushState).toHaveBeenCalledWith(123, '', '#/to/schedule');

    writeSegments(history, '/', true, ['to', 'schedule'], ROUTER_INTENT_FORWARD, 123, 'flag=true');
    expect(history.pushState).toHaveBeenCalledWith(123, '', '#/to/schedule?flag=true');
  });

  it('should write non root path (no hash)', () => {
    const history = mockHistory();
    writeSegments(history, '/path', true, [''], ROUTER_INTENT_FORWARD, 123);
    expect(history.pushState).toHaveBeenCalledWith(123, '', '#/path');

    writeSegments(history, '/path', true, ['to', 'page'], ROUTER_INTENT_FORWARD, 123);
    expect(history.pushState).toHaveBeenCalledWith(123, '', '#/path/to/page');

    writeSegments(history, 'path/to', true, ['second', 'page'], ROUTER_INTENT_FORWARD, 123);
    expect(history.pushState).toHaveBeenCalledWith(123, '', '#/path/to/second/page');

    writeSegments(history, '/path/to/', true, ['second', 'page'], ROUTER_INTENT_FORWARD, 123);
    expect(history.pushState).toHaveBeenCalledWith(123, '', '#/path/to/second/page');

    writeSegments(history, '/path/to/', true, ['second', 'page'], ROUTER_INTENT_FORWARD, 123, 'flag=true');
    expect(history.pushState).toHaveBeenCalledWith(123, '', '#/path/to/second/page?flag=true');
  });

  it('should append the fragment after the query string (no hash)', () => {
    const history = mockHistory();
    writeSegments(history, '/', false, ['catalog'], ROUTER_INTENT_FORWARD, 1, 'x=1', 'pens');
    expect(history.pushState).toHaveBeenCalledWith(1, '', '/catalog?x=1#pens');
  });

  it('should append the fragment when there is no query string (no hash)', () => {
    const history = mockHistory();
    writeSegments(history, '/', false, ['catalog'], ROUTER_INTENT_FORWARD, 1, undefined, 'pens');
    expect(history.pushState).toHaveBeenCalledWith(1, '', '/catalog#pens');
  });

  it('should append the fragment in hash routing mode', () => {
    // In hash routing the routing "#" wraps the path; the URL fragment is a second "#" appended at the end.
    const history = mockHistory();
    writeSegments(history, '/', true, ['catalog'], ROUTER_INTENT_FORWARD, 1, undefined, 'pens');
    expect(history.pushState).toHaveBeenCalledWith(1, '', '#/catalog#pens');
  });

  it('should omit the fragment when none is provided', () => {
    const history = mockHistory();
    writeSegments(history, '/', false, ['catalog'], ROUTER_INTENT_FORWARD, 1);
    expect(history.pushState).toHaveBeenCalledWith(1, '', '/catalog');
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
    hash,
  } as Location;
}
