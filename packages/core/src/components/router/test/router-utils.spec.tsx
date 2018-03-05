import {
  RouterEntries, RouterSegments, breadthFirstSearch,
  generatePath, matchRoute, parsePath
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

// describe('readRoutes', () => {
//   it('should read URL', () => {
//     const node = (<div>
//       <ion-route path='/' component='main-page'/>
//       <ion-route path='/one-page' component='one-page'/>
//       <ion-route path='secondpage' component='second-page'/>
//       <ion-route path='/5/hola' component='4'/>
//       <ion-route path='path/to/five' component='5'/>
//     </div>) as any;
//     node.children = node.vchildren;

//     expect(readRoutes(node)).toEqual([
//       { path: [''], id: 'hola', subroutes: [] },
//       { path: ['one-page'], id: 'one-page', subroutes: [] },
//       { path: ['secondpage'], id: 'second-page', subroutes: [] },
//       { path: ['5', 'hola'], id: '4', subroutes: [] },
//       { path: ['path', 'to', 'five'], id: '5', subroutes: [] }
//     ]);
//   });
// });

describe('matchRoute', () => {
  it('should match simple route', () => {
    const seg = new RouterSegments(['path', 'to', 'component']);
    const routes: RouterEntries = [
      { id: 2, path: ['to'], subroutes: [] },
      { id: 1, path: ['path'], subroutes: [] },
      { id: 3, path: ['segment'], subroutes: [] },
      { id: 4, path: [''], subroutes: [] },
    ];
    const match = matchRoute(seg, routes);
    expect(match).toEqual({ id: 1, path: ['path'], subroutes: [] });
    expect(seg.next()).toEqual('to');
  });

  it('should match default route', () => {
    const routes: RouterEntries = [
      { id: 2, path: ['to'], subroutes: [] },
      { id: 1, path: ['path'], subroutes: [] },
      { id: 3, path: ['segment'], subroutes: [] },
      { id: 4, path: [''], subroutes: [] },
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
    const routes: RouterEntries = [
      { id: 2, path: ['to', 'to', 'to'], subroutes: [] },
      { id: 1, path: ['adam', 'manu'], subroutes: [] },
      { id: 3, path: ['hola', 'adam'], subroutes: [] },
      { id: 4, path: [''], subroutes: [] },
    ];
    const seg = new RouterSegments(['hola', 'manu', 'adam']);
    const match = matchRoute(seg, routes);
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
    const routes: RouterEntries = [
      { id: 1, path: ['adam', 'manu'], subroutes: [] },
      { id: 3, path: ['hola', 'adam'], subroutes: [] },
    ];
    const seg = new RouterSegments(['adam']);
    expect(matchRoute(seg, routes)).toBeNull();
    expect(matchRoute(seg, routes)).toBeNull();
    expect(matchRoute(seg, routes)).toBeNull();
  });

  it ('should match multiple segments', () => {
    const routes: RouterEntries = [
      { id: 1, path: ['adam', 'manu'], subroutes: [] },
      { id: 2, path: ['manu', 'hello'], subroutes: [] },
      { id: 3, path: ['hello'], subroutes: [] },
      { id: 4, path: [''], subroutes: [] },
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
    const routes: RouterEntries = [
      { id: 1, path: ['adam', 'manu', 'hello', 'menu', 'hello'], subroutes: [] },
      { id: 2, path: ['adam', 'manu', 'hello', 'menu'], subroutes: [] },
      { id: 3, path: ['adam', 'manu'], subroutes: [] },
    ];
    const seg = new RouterSegments(['adam', 'manu', 'hello', 'menu', 'hello']);
    const match = matchRoute(seg, routes);
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

