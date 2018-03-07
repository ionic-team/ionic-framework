import { RouteChain } from '../utils/interfaces';
import { matchesIDs, matchesPath, mergeParams, routerPathToChain } from '../utils/matching';
import { parsePath } from '../utils/path';

const CHAIN_1: RouteChain = [
  { id: '2', path: ['to'], params: undefined },
  { id: '1', path: ['path'], params: undefined },
  { id: '3', path: ['segment'], params: undefined },
  { id: '4', path: [''], params: undefined },
];

const CHAIN_2: RouteChain = [
  { id: '2', path: [''], params: undefined },
  { id: '1', path: [''], params: undefined },
  { id: '3', path: ['segment', 'to'], params: undefined },
  { id: '4', path: [''], params: undefined },
  { id: '5', path: ['hola'], params: undefined },
  { id: '6', path: [''], params: undefined },
  { id: '7', path: [''], params: undefined },
  { id: '8', path: ['adios', 'que', 'tal'], params: undefined },
];

const CHAIN_3: RouteChain = [
  { id: '2', path: ['this', 'to'], params: undefined },
  { id: '1', path: ['path'], params: undefined },
  { id: '3', path: ['segment', 'to', 'element'], params: undefined },
  { id: '4', path: [''], params: undefined },
];



describe('matchesIDs', () => {
  it('should match simple set of ids', () => {
    const chain: RouteChain = CHAIN_1;
    expect(matchesIDs(['2'], chain)).toBe(1);
    expect(matchesIDs(['2', '1'], chain)).toBe(2);
    expect(matchesIDs(['2', '1', '3'], chain)).toBe(3);
    expect(matchesIDs(['2', '1', '3', '4'], chain)).toBe(4);
    expect(matchesIDs(['2', '1', '3', '4', '5'], chain)).toBe(4);

    expect(matchesIDs([], chain)).toBe(0);
    expect(matchesIDs(['1'], chain)).toBe(0);
  });
});

describe('matchesPath', () => {
  it('should match simple path', () => {
    const chain: RouteChain = CHAIN_3;
    expect(matchesPath(['this'], chain)).toEqual(null);
    expect(matchesPath(['this', 'to'], chain)).toEqual(null);
    expect(matchesPath(['this', 'to', 'path'], chain)).toEqual(null);
    expect(matchesPath(['this', 'to', 'path', 'segment'], chain)).toEqual(null);
    expect(matchesPath(['this', 'to', 'path', 'segment', 'to'], chain)).toEqual(null);
    expect(matchesPath(['this', 'to', 'path', 'segment', 'to', 'element'], chain)).toEqual(chain);
    expect(matchesPath(['this', 'to', 'path', 'segment', 'to', 'element', 'more'], chain)).toEqual(null);

    expect(matchesPath([], chain)).toEqual(null);
    expect(matchesPath([''], chain)).toEqual(null);
    expect(matchesPath(['path'], chain)).toEqual(null);
  });

  it('should match simple default route', () => {
    const chain: RouteChain = CHAIN_2;
    expect(matchesPath([''], chain)).toEqual(null);
    expect(matchesPath(['segment'], chain)).toEqual(null);
    expect(matchesPath(['segment', 'to'], chain)).toEqual(null);
    expect(matchesPath(['segment', 'to', 'hola'], chain)).toEqual(null);
    expect(matchesPath(['segment', 'to', 'hola', 'adios'], chain)).toEqual(null);
    expect(matchesPath(['segment', 'to', 'hola', 'adios', 'que'], chain)).toEqual(null);
    expect(matchesPath(['segment', 'to', 'hola', 'adios', 'que', 'tal'], chain)).toEqual(chain);
    expect(matchesPath(['segment', 'to', 'hola', 'adios', 'que', 'tal', 'more'], chain)).toEqual(chain);

    expect(matchesPath(['to'], chain)).toEqual(null);
    expect(matchesPath(['path', 'to'], chain)).toEqual(null);
  });

  it('should match simple route 2', () => {
    const chain: RouteChain = [{ id: '5', path: ['hola'], params: undefined }];
    expect(matchesPath([''], chain)).toEqual(null);
    expect(matchesPath(['hola'], chain)).toEqual(chain);
    expect(matchesPath(['hola', 'hola'], chain)).toEqual(chain);
    expect(matchesPath(['hola', 'adios'], chain)).toEqual(chain);
  });

  it('should match simple route 3', () => {
    const chain: RouteChain = [{ id: '5', path: ['hola', 'adios'], params: undefined }];
    expect(matchesPath([''], chain)).toEqual(null);
    expect(matchesPath(['hola'], chain)).toEqual(null);
    expect(matchesPath(['hola', 'hola'], chain)).toEqual(null);
    expect(matchesPath(['hola', 'adios'], chain)).toEqual(chain);
    expect(matchesPath(['hola', 'adios', 'bye'], chain)).toEqual(chain);
  });

  it('should match simple route 4', () => {
    const chain: RouteChain = [
      { id: '5', path: ['hola'], params: undefined },
      { id: '5', path: ['adios'], params: undefined }];

    expect(matchesPath([''], chain)).toEqual(null);
    expect(matchesPath(['hola'], chain)).toEqual(null);
    expect(matchesPath(['hola', 'hola'], chain)).toEqual(null);
    expect(matchesPath(['hola', 'adios'], chain)).toEqual(chain);
  });

  it('should match with parameters', () => {
    const chain: RouteChain = [
      { id: '5', path: ['profile', ':name'], params: undefined },
      { id: '5', path: [''], params: undefined },
      { id: '5', path: ['image'], params: {size: 'lg'} },
      { id: '5', path: ['image', ':size', ':type'], params: {size: 'mg'} },
    ];
    const matched = matchesPath(parsePath('/profile/manu/image/image/large/retina'), chain);
    expect(matched).toEqual([
      { id: '5', path: ['profile', ':name'], params: {name: 'manu'} },
      { id: '5', path: [''], params: undefined },
      { id: '5', path: ['image'], params: {size: 'lg'} },
      { id: '5', path: ['image', ':size', ':type'], params: {size: 'large', type: 'retina'} },
    ]);
  });
});

describe('routerPathToChain', () => {
  it('should match the route with higher priority', () => {
    const chain3: RouteChain = [{ id: '5', path: ['hola'], params: undefined }];
    const chain4: RouteChain = [
      { id: '5', path: ['hola'], params: undefined },
      { id: '5', path: ['adios'], params: undefined }];

    const routes: RouteChain[] = [
      CHAIN_1,
      CHAIN_2,
      chain3,
      chain4
    ];
    expect(routerPathToChain(['to'], routes)).toEqual({
      chain: null,
      matches: 0,
    });

    expect(routerPathToChain([''], routes)).toEqual({
      chain: null,
      matches: 0,
    });
    expect(routerPathToChain(['segment', 'to'], routes)).toEqual({
      chain: null,
      matches: 0,
    });

    expect(routerPathToChain(['hola'], routes)).toEqual({
      chain: chain3,
      matches: 1,
    });
    expect(routerPathToChain(['hola', 'hola'], routes)).toEqual({
      chain: chain3,
      matches: 1,
    });

    expect(routerPathToChain(['hola', 'adios'], routes)).toEqual({
      chain: chain4,
      matches: 2,
    });

  });

  it('should match the default route', () => {
    const chain1: RouteChain = [
      { id: 'tabs', path: [''], params: undefined },
      { id: 'tab1', path: [''], params: undefined },
      { id: 'schedule', path: [''], params: undefined }
    ];
    const chain2: RouteChain = [
      { id: 'tabs', path: [''], params: undefined },
      { id: 'tab2', path: ['tab2'], params: undefined },
      { id: 'page2', path: [''], params: undefined }
    ];

    expect(routerPathToChain([''], [chain1])).toEqual({chain: chain1, matches: 3});
    expect(routerPathToChain(['tab2'], [chain1])).toEqual({chain: null, matches: 0});

    expect(routerPathToChain([''], [chain2])).toEqual({chain: null, matches: 0});
    expect(routerPathToChain(['tab2'], [chain2])).toEqual({chain: chain2, matches: 3});
  });
});

describe('mergeParams', () => {
  it('should merge undefined', () => {
    expect(mergeParams(undefined, undefined)).toBeUndefined();
    expect(mergeParams(null, undefined)).toBeUndefined();
    expect(mergeParams(undefined, null)).toBeUndefined();
    expect(mergeParams(null, null)).toBeUndefined();
  });

  it('should merge undefined with params', () => {
    const params = {data: '1'};
    expect(mergeParams(undefined, params)).toEqual(params);
    expect(mergeParams(null, params)).toEqual(params);
    expect(mergeParams(params, undefined)).toEqual(params);
    expect(mergeParams(params, null)).toEqual(params);
  });

  it('should merge params with params', () => {
    const params1 = {data: '1', data3: 'hello'};
    const params2 = {data: '2', data2: 'hola'};

    expect(mergeParams(params1, params2)).toEqual({
      data: '2',
      data2: 'hola',
      data3: 'hello'
    });
    expect(params1).toEqual({data: '1', data3: 'hello'});
    expect(params2).toEqual({data: '2', data2: 'hola'});
  });
});

// describe('matchRoute', () => {
//   it('should match simple route', () => {
//     const path = ['path', 'to', 'component'];
//     const routes: RouteChain[] = [
//       [{ id: 2, path: ['to'], params: undefined }],
//       [{ id: 1, path: ['path'], params: undefined }],
//       [{ id: 3, path: ['segment'], params: undefined }],
//       [{ id: 4, path: [''], params: undefined }],
//     ];
//     const match = routerPathToChain(path, routes);
//     expect(match).toEqual({ id: 1, path: ['path'], children: [] });
//     expect(seg.next()).toEqual('to');
//   });

//   it('should match default route', () => {
//     const routes: RouteTree = [
//       { id: 2, path: ['to'], children: [], params: undefined },
//       { id: 1, path: ['path'], children: [], params: undefined },
//       { id: 3, path: ['segment'], children: [], params: undefined },
//       { id: 4, path: [''], children: [], params: undefined },
//     ];
//     const seg = new RouterSegments(['hola', 'path']);
//     let match = matchRoute(seg, routes);
//     expect(match).toBeNull();

//     match = matchRoute(seg, routes);
//     expect(match.id).toEqual(1);

//     for (let i = 0; i < 20; i++) {
//       match = matchRoute(seg, routes);
//       expect(match.id).toEqual(4);
//     }
//   });

//   it('should not match any route', () => {
//     const routes: RouteTree = [
//       { id: 2, path: ['to', 'to', 'to'], children: [], params: undefined },
//       { id: 1, path: ['adam', 'manu'], children: [], params: undefined },
//       { id: 3, path: ['hola', 'adam'], children: [], params: undefined },
//       { id: 4, path: [''], children: [], params: undefined },
//     ];
//     const seg = new RouterSegments(['hola', 'manu', 'adam']);
//     const match = matchRoute(seg, routes);
//     expect(match).toBeNull();
//   });

//   it('should not match if there are not routes', () => {
//     const routes: RouteTree = [];
//     const seg = new RouterSegments(['adam']);
//     expect(matchRoute(seg, routes)).toBeNull();
//     expect(matchRoute(seg, routes)).toBeNull();
//     expect(matchRoute(seg, routes)).toBeNull();
//   });

//   it('should not match any route (2)', () => {
//     const routes: RouteTree = [
//       { id: 1, path: ['adam', 'manu'], children: [], params: undefined },
//       { id: 3, path: ['hola', 'adam'], children: [], params: undefined },
//     ];
//     const seg = new RouterSegments(['adam']);
//     expect(matchRoute(seg, routes)).toBeNull();
//     expect(matchRoute(seg, routes)).toBeNull();
//     expect(matchRoute(seg, routes)).toBeNull();
//   });

//   it ('should match multiple segments', () => {
//     const routes: RouteTree = [
//       { id: 1, path: ['adam', 'manu'], children: [], params: undefined },
//       { id: 2, path: ['manu', 'hello'], children: [], params: undefined },
//       { id: 3, path: ['hello'], children: [], params: undefined },
//       { id: 4, path: [''], children: [], params: undefined },
//     ];
//     const seg = new RouterSegments(['adam', 'manu', 'hello', 'manu', 'hello']);
//     let match = matchRoute(seg, routes);
//     expect(match.id).toEqual(1);

//     match = matchRoute(seg, routes);
//     expect(match.id).toEqual(3);

//     match = matchRoute(seg, routes);
//     expect(match.id).toEqual(2);

//     match = matchRoute(seg, routes);
//     expect(match.id).toEqual(4);

//     match = matchRoute(seg, routes);
//     expect(match.id).toEqual(4);
//   });

//   it('should match long multi segments', () => {
//     const routes: RouteTree = [
//       { id: 1, path: ['adam', 'manu', 'hello', 'menu', 'hello'], children: [], params: undefined },
//       { id: 2, path: ['adam', 'manu', 'hello', 'menu'], children: [], params: undefined },
//       { id: 3, path: ['adam', 'manu'], children: [], params: undefined },
//     ];
//     const seg = new RouterSegments(['adam', 'manu', 'hello', 'menu', 'hello']);
//     const match = matchRoute(seg, routes);
//     expect(match.id).toEqual(1);
//     expect(matchRoute(seg, routes)).toBeNull();
//   });

//   it('should match long multi segments', () => {
//     let match = matchRoute(new RouterSegments(['']), null);
//     expect(match).toBeNull();

//     match = matchRoute(new RouterSegments(['hola']), null);
//     expect(match).toBeNull();
//   });
// });
