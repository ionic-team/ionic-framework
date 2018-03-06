import { RouteChain } from '../utils/interfaces';
import { matchesIDs, matchesPath, routerPathToChain } from '../utils/matching';
import { mockRouteElement } from './parser.spec';
import { mockElement } from '@stencil/core/dist/testing';

const CHAIN_1: RouteChain = [
  { id: '2', path: ['to'], props: undefined },
  { id: '1', path: ['path'], props: undefined },
  { id: '3', path: ['segment'], props: undefined },
  { id: '4', path: [''], props: undefined },
];

const CHAIN_2: RouteChain = [
  { id: '2', path: [''], props: undefined },
  { id: '1', path: [''], props: undefined },
  { id: '3', path: ['segment', 'to'], props: undefined },
  { id: '4', path: [''], props: undefined },
  { id: '5', path: ['hola'], props: undefined },
  { id: '6', path: [''], props: undefined },
  { id: '7', path: [''], props: undefined },
  { id: '8', path: ['adios', 'que', 'tal'], props: undefined },
];

const CHAIN_3: RouteChain = [
  { id: '2', path: ['this', 'to'], props: undefined },
  { id: '1', path: ['path'], props: undefined },
  { id: '3', path: ['segment', 'to', 'element'], props: undefined },
  { id: '4', path: [''], props: undefined },
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
    expect(matchesPath(['this'], chain)).toBe(false);
    expect(matchesPath(['this', 'to'], chain)).toBe(false);
    expect(matchesPath(['this', 'to', 'path'], chain)).toBe(false);
    expect(matchesPath(['this', 'to', 'path', 'segment'], chain)).toBe(false);
    expect(matchesPath(['this', 'to', 'path', 'segment', 'to'], chain)).toBe(false);
    expect(matchesPath(['this', 'to', 'path', 'segment', 'to', 'element'], chain)).toBe(true);
    expect(matchesPath(['this', 'to', 'path', 'segment', 'to', 'element', 'more'], chain)).toBe(false);

    expect(matchesPath([], chain)).toBe(false);
    expect(matchesPath([''], chain)).toBe(false);
    expect(matchesPath(['path'], chain)).toBe(false);
  });

  it('should match simple default route', () => {
    const chain: RouteChain = CHAIN_2;
    expect(matchesPath([''], chain)).toBe(false);
    expect(matchesPath(['segment'], chain)).toBe(false);
    expect(matchesPath(['segment', 'to'], chain)).toBe(false);
    expect(matchesPath(['segment', 'to', 'hola'], chain)).toBe(false);
    expect(matchesPath(['segment', 'to', 'hola', 'adios'], chain)).toBe(false);
    expect(matchesPath(['segment', 'to', 'hola', 'adios', 'que'], chain)).toBe(false);
    expect(matchesPath(['segment', 'to', 'hola', 'adios', 'que', 'tal'], chain)).toBe(true);

    expect(matchesPath(['to'], chain)).toBe(false);
    expect(matchesPath(['path', 'to'], chain)).toBe(false);
  });

  it('should match simple route 2', () => {
    const chain: RouteChain = [{ id: '5', path: ['hola'], props: undefined }];
    expect(matchesPath([''], chain)).toBe(false);
    expect(matchesPath(['hola'], chain)).toBe(true);
    expect(matchesPath(['hola', 'hola'], chain)).toBe(true);
    expect(matchesPath(['hola', 'adios'], chain)).toBe(true);
  });

  it('should match simple route 3', () => {
    const chain: RouteChain = [{ id: '5', path: ['hola', 'adios'], props: undefined }];
    expect(matchesPath([''], chain)).toBe(false);
    expect(matchesPath(['hola'], chain)).toBe(false);
    expect(matchesPath(['hola', 'hola'], chain)).toBe(false);
    expect(matchesPath(['hola', 'adios'], chain)).toBe(true);
  });

  it('should match simple route 4', () => {
    const chain: RouteChain = [
      { id: '5', path: ['hola'], props: undefined },
      { id: '5', path: ['adios'], props: undefined }];

    expect(matchesPath([''], chain)).toBe(false);
    expect(matchesPath(['hola'], chain)).toBe(false);
    expect(matchesPath(['hola', 'hola'], chain)).toBe(false);
    expect(matchesPath(['hola', 'adios'], chain)).toBe(true);
  });
});

describe('routerPathToChain', () => {
  it('should match the route with higher priority', () => {
    const chain3: RouteChain = [{ id: '5', path: ['hola'], props: undefined }];
    const chain4: RouteChain = [
      { id: '5', path: ['hola'], props: undefined },
      { id: '5', path: ['adios'], props: undefined }];

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
      { id: 'tabs', path: [''], props: undefined },
      { id: 'tab1', path: [''], props: undefined },
      { id: 'schedule', path: [''], props: undefined }
    ];
    const chain2: RouteChain = [
      { id: 'tabs', path: [''], props: undefined },
      { id: 'tab2', path: ['tab2'], props: undefined },
      { id: 'page2', path: [''], props: undefined }
    ];

    expect(routerPathToChain([''], [chain1])).toEqual({chain: chain1, matches: 3});
    expect(routerPathToChain(['tab2'], [chain1])).toEqual({chain: null, matches: 0});

    expect(routerPathToChain([''], [chain2])).toEqual({chain: null, matches: 0});
    expect(routerPathToChain(['tab2'], [chain2])).toEqual({chain: chain2, matches: 3});

  });


});

// describe('matchRoute', () => {
//   it('should match simple route', () => {
//     const path = ['path', 'to', 'component'];
//     const routes: RouteChain[] = [
//       [{ id: 2, path: ['to'], props: undefined }],
//       [{ id: 1, path: ['path'], props: undefined }],
//       [{ id: 3, path: ['segment'], props: undefined }],
//       [{ id: 4, path: [''], props: undefined }],
//     ];
//     const match = routerPathToChain(path, routes);
//     expect(match).toEqual({ id: 1, path: ['path'], children: [] });
//     expect(seg.next()).toEqual('to');
//   });

//   it('should match default route', () => {
//     const routes: RouteTree = [
//       { id: 2, path: ['to'], children: [], props: undefined },
//       { id: 1, path: ['path'], children: [], props: undefined },
//       { id: 3, path: ['segment'], children: [], props: undefined },
//       { id: 4, path: [''], children: [], props: undefined },
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
//       { id: 2, path: ['to', 'to', 'to'], children: [], props: undefined },
//       { id: 1, path: ['adam', 'manu'], children: [], props: undefined },
//       { id: 3, path: ['hola', 'adam'], children: [], props: undefined },
//       { id: 4, path: [''], children: [], props: undefined },
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
//       { id: 1, path: ['adam', 'manu'], children: [], props: undefined },
//       { id: 3, path: ['hola', 'adam'], children: [], props: undefined },
//     ];
//     const seg = new RouterSegments(['adam']);
//     expect(matchRoute(seg, routes)).toBeNull();
//     expect(matchRoute(seg, routes)).toBeNull();
//     expect(matchRoute(seg, routes)).toBeNull();
//   });

//   it ('should match multiple segments', () => {
//     const routes: RouteTree = [
//       { id: 1, path: ['adam', 'manu'], children: [], props: undefined },
//       { id: 2, path: ['manu', 'hello'], children: [], props: undefined },
//       { id: 3, path: ['hello'], children: [], props: undefined },
//       { id: 4, path: [''], children: [], props: undefined },
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
//       { id: 1, path: ['adam', 'manu', 'hello', 'menu', 'hello'], children: [], props: undefined },
//       { id: 2, path: ['adam', 'manu', 'hello', 'menu'], children: [], props: undefined },
//       { id: 3, path: ['adam', 'manu'], children: [], props: undefined },
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
