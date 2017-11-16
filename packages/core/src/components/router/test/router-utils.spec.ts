import {
  RouterEntries, RouterEntry, RouterSegments, breadthFirstSearch,
  generateURL, initRoute, matchRoute, parseURL
} from '../router-utils';

describe('RouterSegments', () => {
  it ('should initialize with empty array', () => {
    const s = new RouterSegments([]);
    expect(s.next()).toEqual('');
    expect(s.next()).toEqual('');
    expect(s.next()).toEqual('');
    expect(s.next()).toEqual('');
    expect(s.next()).toEqual('');
  });

  it ('should initialize with array', () => {
    const s = new RouterSegments(['', 'path', 'to', 'destination']);
    expect(s.next()).toEqual('');
    expect(s.next()).toEqual('path');
    expect(s.next()).toEqual('to');
    expect(s.next()).toEqual('destination');
    expect(s.next()).toEqual('');
    expect(s.next()).toEqual('');
  });
});

describe('parseURL', () => {
  it('should parse empty path', () => {
    expect(parseURL('')).toEqual(['']);
  });

  it('should parse empty path (2)', () => {
    expect(parseURL('   ')).toEqual(['']);
  });

  it('should parse null path', () => {
    expect(parseURL(null)).toEqual(['']);
  });

  it('should parse undefined path', () => {
    expect(parseURL(undefined)).toEqual(['']);
  });

  it('should parse relative path', () => {
    expect(parseURL('path/to/file.js')).toEqual(['path', 'to', 'file.js']);
  });

  it('should parse absolute path', () => {
    expect(parseURL('/path/to/file.js')).toEqual(['path', 'to', 'file.js']);
  });
  it('should parse relative path', () => {
    expect(parseURL('/PATH///to//file.js//')).toEqual(['PATH', 'to', 'file.js']);
  });
});

describe('initRoute', () => {
  it('should initialize empty segments', () => {
    const route: RouterEntry = {
      id: 'cmp',
      path: 'path/to/cmp'
    };
    initRoute(route);
    expect(route.segments).toEqual(['path', 'to', 'cmp']);
  });

  it('should not initialize valid segments', () => {
    const route: RouterEntry = {
      id: 'cmp',
      path: 'path/to/cmp',
      segments: ['']
    };
    initRoute(route);
    expect(route.segments).toEqual(['']);
  });
});

describe('matchRoute', () => {
  it('should match simple route', () => {
    const seg = new RouterSegments(['path', 'to', 'component']);
    const routes = [
      { id: 2, path: 'to' },
      { id: 1, path: 'path' },
      { id: 3, path: 'segment' },
      { id: 4, path: '' },
    ];
    const match = matchRoute(seg, routes);
    expect(match).toEqual({ id: 1, path: 'path', segments: ['path'] });
    expect(seg.next()).toEqual('to');
  });

  it('should match default route', () => {
    const routes = [
      { id: 2, path: 'to' },
      { id: 1, path: 'path' },
      { id: 3, path: 'segment' },
      { id: 4, path: '' },
    ];
    const seg = new RouterSegments(['hola', 'path']);
    let match = matchRoute(seg, routes);
    expect(match).toBeNull();

    match = matchRoute(seg, routes);
    expect(match.id).toEqual(1);

    for (let i = 0; i < 20; i++) {
      match = matchRoute(seg, routes);
      expect(match.id).toEqual(4);
    }
  });


  it('should not match any route', () => {
    const routes = [
      { id: 2, path: 'to/to/to' },
      { id: 1, path: 'adam/manu' },
      { id: 3, path: 'hola/adam' },
      { id: 4, path: '' },
    ];
    const seg = new RouterSegments(['hola', 'manu', 'adam']);
    let match = matchRoute(seg, routes);
    expect(match).toBeNull();
  });

  it('should not match if there are not routes', () => {
    const routes: RouterEntries = [];
    const seg = new RouterSegments(['adam']);
    expect(matchRoute(seg, routes)).toBeNull();
    expect(matchRoute(seg, routes)).toBeNull();
    expect(matchRoute(seg, routes)).toBeNull();
  });

  it('should not match any route (2)', () => {
    const routes = [
      { id: 1, path: 'adam/manu' },
      { id: 3, path: 'hola/adam' },
    ];
    const seg = new RouterSegments(['adam']);
    expect(matchRoute(seg, routes)).toBeNull();
    expect(matchRoute(seg, routes)).toBeNull();
    expect(matchRoute(seg, routes)).toBeNull();
  });

  it ('should match multiple segments', () => {
    const routes = [
      { id: 1, path: 'adam/manu' },
      { id: 2, path: 'manu/hello' },
      { id: 3, path: 'hello' },
      { id: 4, path: '' },
    ];
    const seg = new RouterSegments(['adam', 'manu', 'hello', 'manu', 'hello']);
    let match = matchRoute(seg, routes);
    expect(match.id).toEqual(1);

    match = matchRoute(seg, routes);
    expect(match.id).toEqual(3);

    match = matchRoute(seg, routes);
    expect(match.id).toEqual(2);

    match = matchRoute(seg, routes);
    expect(match.id).toEqual(4);

    match = matchRoute(seg, routes);
    expect(match.id).toEqual(4);
  });

  it('should match long multi segments', () => {
    const routes = [
      { id: 1, path: 'adam/manu/hello/menu/hello' },
      { id: 2, path: 'adam/manu/hello/menu' },
      { id: 3, path: 'adam/manu' },
    ];
    const seg = new RouterSegments(['adam', 'manu', 'hello', 'menu', 'hello']);
    let match = matchRoute(seg, routes);
    expect(match.id).toEqual(1);
    expect(matchRoute(seg, routes)).toBeNull();
  });

  it('should match long multi segments', () => {
    let match = matchRoute(new RouterSegments(['']), null);
    expect(match).toBeNull();

    match = matchRoute(new RouterSegments(['hola']), null);
    expect(match).toBeNull();
  });
});


describe('generateURL', () => {
  it('should generate an empty URL', () => {
    expect(generateURL([])).toEqual('/');
    expect(generateURL([{ path: '' } as any])).toEqual('/');
    expect(generateURL([{ path: '/' } as any])).toEqual('/');
    expect(generateURL([{ path: '//' } as any])).toEqual('/');
    expect(generateURL([{ path: '  ' } as any])).toEqual('/');
  });

  it('should genenerate a basic url', () => {
    const state = [
      { path: '/' },
      { path: '/ ' },
      { path: '' },
      { path: '/path// to/' },
      { path: '/page  ' },
      { path: 'number-TWO/' },
      { path: '   / ' }
    ];
    expect(generateURL(state as any)).toEqual('/path/to/page/number-TWO');

  });
});

describe('breadthFirstSearch', () => {
  it('should search in order', () => {
    const n1 = { tagName: 'ION-TABS', children: [] as any };
    const n2 = { tagName: 'DIV', children: [n1] };
    const n3 = { tagName: 'ION-NAV', children: [n2] };
    const n4 = { tagName: 'ION-TABS', children: [] as any };
    const n5 = { tagName: 'DIV', children: [n4] };
    const n6 = { tagName: 'DIV', children: [n5, n3] };
    const n7 = { tagName: 'DIV', children: [] as any };
    const n8 = { tagName: 'DIV', children: [n6] };
    const n9 = { tagName: 'DIV', children: [n8, n7] };

    expect(breadthFirstSearch(n9 as any)).toBe(n3);
    expect(breadthFirstSearch(n8 as any)).toBe(n3);
    expect(breadthFirstSearch(n7 as any)).toBe(null);
    expect(breadthFirstSearch(n6 as any)).toBe(n3);
    expect(breadthFirstSearch(n5 as any)).toBe(n4);
    expect(breadthFirstSearch(n4 as any)).toBe(n4);
    expect(breadthFirstSearch(n3 as any)).toBe(n3);
    expect(breadthFirstSearch(n2 as any)).toBe(n1);
    expect(breadthFirstSearch(n1 as any)).toBe(n1);
  });
});

describe('readNavState', () => {
  it('should read state', () => {

  });
});
