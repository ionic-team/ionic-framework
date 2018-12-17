import { RouteChain } from '../utils/interface';
import { RouterSegments, matchesIDs, matchesPath, matchesRedirect, mergeParams, routerPathToChain } from '../utils/matching';
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
      { id: '5', path: ['image'], params: { size: 'lg' } },
      { id: '5', path: ['image', ':size', ':type'], params: { size: 'mg' } },
    ];
    const matched = matchesPath(parsePath('/profile/manu/image/image/large/retina'), chain);
    expect(matched).toEqual([
      { id: '5', path: ['profile', ':name'], params: { name: 'manu' } },
      { id: '5', path: [''], params: undefined },
      { id: '5', path: ['image'], params: { size: 'lg' } },
      { id: '5', path: ['image', ':size', ':type'], params: { size: 'large', type: 'retina' } },
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
    expect(routerPathToChain(['to'], routes)).toEqual(null);
    expect(routerPathToChain([''], routes)).toEqual(null);
    expect(routerPathToChain(['segment', 'to'], routes)).toEqual(null);
    expect(routerPathToChain(['hola'], routes)).toEqual(chain3);
    expect(routerPathToChain(['hola', 'hola'], routes)).toEqual(chain3);
    expect(routerPathToChain(['hola', 'adios'], routes)).toEqual(chain4);
  });

  it('should match the route with higher priority 2', () => {

    const chain1: RouteChain = [{ id: '1', path: ['categories', ':category_slug'], params: undefined }];
    const chain2: RouteChain = [{ id: '2', path: ['workouts', ':workout_slug'], params: undefined }];
    const chain3: RouteChain = [{ id: '3', path: ['workouts', ':workout_slug', 'time-select'], params: undefined }];
    const chain4: RouteChain = [{ id: '4', path: ['workouts', ':workout_slug', 'end-workout'], params: undefined }];
    const chain5: RouteChain = [{ id: '5', path: ['plans'], params: undefined }];
    const chain6: RouteChain = [{ id: '6', path: ['custom'], params: undefined }];
    const chain7: RouteChain = [{ id: '7', path: ['workouts', 'list'], params: undefined }];

    const routes: RouteChain[] = [
      chain1,
      chain2,
      chain3,
      chain4,
      chain5,
      chain6,
      chain7
    ];
    // no match
    expect(routerPathToChain(['categories'], routes)).toEqual(null);
    expect(routerPathToChain(['workouts'], routes)).toEqual(null);

    expect(routerPathToChain(['plans'], routes)).toEqual(chain5);
    expect(routerPathToChain(['custom'], routes)).toEqual(chain6);
    expect(routerPathToChain(['workouts', 'list'], routes)).toEqual(chain7);

    expect(routerPathToChain(['workouts', 'hola'], routes)).toEqual(
      [{ id: '2', path: ['workouts', ':workout_slug'], params: { 'workout_slug': 'hola' } }]
    );
    expect(routerPathToChain(['workouts', 'hello', 'time-select'], routes)).toEqual(
      [{ id: '3', path: ['workouts', ':workout_slug', 'time-select'], params: { 'workout_slug': 'hello' } }]
    );
    expect(routerPathToChain(['workouts', 'hello2', 'end-workout'], routes)).toEqual(
      [{ id: '4', path: ['workouts', ':workout_slug', 'end-workout'], params: { 'workout_slug': 'hello2' } }]
    );
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

    expect(routerPathToChain([''], [chain1])).toEqual(chain1);
    expect(routerPathToChain(['tab2'], [chain1])).toEqual(null);

    expect(routerPathToChain([''], [chain2])).toEqual(null);
    expect(routerPathToChain(['tab2'], [chain2])).toEqual(chain2);
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
    const params = { data: '1' };
    expect(mergeParams(undefined, params)).toEqual(params);
    expect(mergeParams(null, params)).toEqual(params);
    expect(mergeParams(params, undefined)).toEqual(params);
    expect(mergeParams(params, null)).toEqual(params);
  });

  it('should merge params with params', () => {
    const params1 = { data: '1', data3: 'hello' };
    const params2 = { data: '2', data2: 'hola' };

    expect(mergeParams(params1, params2)).toEqual({
      data: '2',
      data2: 'hola',
      data3: 'hello'
    });
    expect(params1).toEqual({ data: '1', data3: 'hello' });
    expect(params2).toEqual({ data: '2', data2: 'hola' });
  });
});

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

describe('matchesRedirect', () => {
  it('should match empty redirect', () => {
    expect(matchesRedirect([''], { from: [''], to: [''] })).toBeTruthy();
    expect(matchesRedirect([''], { from: ['*'], to: [''] })).toBeTruthy();

    expect(matchesRedirect([''], { from: ['hola'], to: [''] })).toBeFalsy();
    expect(matchesRedirect([''], { from: ['hola', '*'], to: [''] })).toBeFalsy();
  });

  it('should match simple segment redirect', () => {
    expect(matchesRedirect(['workouts'], { from: ['workouts'], to: [''] })).toBeTruthy();
    expect(matchesRedirect(['workouts'], { from: ['*'], to: [''] })).toBeTruthy();
    expect(matchesRedirect(['workouts', 'hola'], { from: ['workouts', '*'], to: [''] })).toBeTruthy();
    expect(matchesRedirect(['workouts', 'hola'], { from: ['workouts', 'hola'], to: [''] })).toBeTruthy();

    expect(matchesRedirect(['workouts'], { from: ['workouts', '*'], to: [''] })).toBeFalsy();
    expect(matchesRedirect(['workouts', 'hola'], { from: ['workouts'], to: [''] })).toBeFalsy();
    expect(matchesRedirect(['workouts', 'hola'], { from: ['workouts', 'adios'], to: [''] })).toBeFalsy();
  });

  it('should match long route', () => {
    expect(matchesRedirect(['workouts', 'path', 'to'], { from: ['*'], to: [''] })).toBeTruthy();
    expect(matchesRedirect(['workouts', 'path', 'to'], { from: ['workouts', '*'], to: [''] })).toBeTruthy();
    expect(matchesRedirect(['workouts', 'path', 'to'], { from: ['workouts', 'path', '*'], to: [''] })).toBeTruthy();
    expect(matchesRedirect(['workouts', 'path', 'to'], { from: ['workouts', 'path', 'to'], to: [''] })).toBeTruthy();

    expect(matchesRedirect(['workouts', 'path', 'to'], { from: ['login'], to: [''] })).toBeFalsy();
    expect(matchesRedirect(['workouts', 'path', 'to'], { from: ['login', '*'], to: [''] })).toBeFalsy();
    expect(matchesRedirect(['workouts', 'path', 'to'], { from: ['workouts'], to: [''] })).toBeFalsy();
    expect(matchesRedirect(['workouts', 'path', 'to'], { from: ['workouts', 'path'], to: [''] })).toBeFalsy();
    expect(matchesRedirect(['workouts', 'path', 'to'], { from: ['workouts', 'path', 'to', '*'], to: [''] })).toBeFalsy();
  });

  it('should not match undefined "to"', () => {
    expect(matchesRedirect(['workouts', 'path', 'to'], { from: ['*'], to: undefined })).toBeFalsy();
    expect(matchesRedirect(['workouts', 'path', 'to'], { from: ['workouts', '*'], to: undefined })).toBeFalsy();
    expect(matchesRedirect(['workouts', 'path', 'to'], { from: ['workouts', 'path', '*'], to: undefined })).toBeFalsy();
    expect(matchesRedirect(['workouts', 'path', 'to'], { from: ['workouts', 'path', 'to'], to: undefined })).toBeFalsy();
  });

});
