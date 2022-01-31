import { ResolvedRouteChain, RouteChain } from '../utils/interface';
import { RouterSegments, matchesIDs, matchesSegments, matchesRedirect, mergeParams, findChainForSegments } from '../utils/matching';
import { parsePath } from '../utils/path';

expect.extend({
  /**
   * Compares the resolved chain vs the expected chain.
   * 
   * The nodes must match at every levels.
   * The expected chain should have the following properties:
   * - id,
   * - segments,
   * - params (only required if there are actual parameters).
   */
  toMatchChain(actual: ResolvedRouteChain, expected: RouteChain) {
    if (actual.length !== expected.length) {
      return {
        pass: false,
        message: () => `Chain length is ${actual.length} vs ${expected.length} expected`,
      }
    }
    for (let i = 0; i < actual.length; i++) {
      expect(actual[i].node.id).toEqual(expected[i].id);
      expect(actual[i].params ?? {}).toEqual(expected[i].params ?? {});
      expect(actual[i].node.segments).toEqual(expected[i].segments);
    }
    return {
      pass: true,
      message: `The resolved chain matches the chain`,
    }
  },  
});

const CHAIN_1: RouteChain = [
  { id: '2', segments: ['to'], params: undefined, children: [] },
  { id: '1', segments: ['path'], params: undefined, children: [] },
  { id: '3', segments: ['segment'], params: undefined, children: [] },
  { id: '4', segments: [''], params: undefined, children: [] },
];

const CHAIN_2: RouteChain = [
  { id: '2', segments: [''], params: undefined, children: [] },
  { id: '1', segments: [''], params: undefined, children: [] },
  { id: '3', segments: ['segment', 'to'], params: undefined, children: [] },
  { id: '4', segments: [''], params: undefined, children: [] },
  { id: '5', segments: ['hola'], params: undefined, children: [] },
  { id: '6', segments: [''], params: undefined, children: [] },
  { id: '7', segments: [''], params: undefined, children: [] },
  { id: '8', segments: ['adios', 'que', 'tal'], params: undefined, children: [] },
];

const CHAIN_3: RouteChain = [
  { id: '2', segments: ['this', 'to'], params: undefined, children: [] },
  { id: '1', segments: ['path'], params: undefined, children: [] },
  { id: '3', segments: ['segment', 'to', 'element'], params: undefined, children: [] },
  { id: '4', segments: [''], params: undefined, children: [] },
];

describe('matchesIDs', () => {
  it('should match simple set of ids', () => {
    const chain: RouteChain = CHAIN_1;
    expect(matchesIDs([{ id: '2' }], chain)).toBe(1);
    expect(matchesIDs([{ id: '2' }, { id: '1' }], chain)).toBe(2);
    expect(matchesIDs([{ id: '2' }, { id: '1' }, { id: '3' }], chain)).toBe(3);
    expect(matchesIDs([{ id: '2' }, { id: '1' }, { id: '3' }, { id: '4' }], chain)).toBe(4);
    expect(matchesIDs([{ id: '2' }, { id: '1' }, { id: '3' }, { id: '4' }, { id: '5' }], chain)).toBe(4);

    expect(matchesIDs([], chain)).toBe(0);
    expect(matchesIDs([{ id: '1' }], chain)).toBe(0);
  });

  it('should match path with params', () => {
    const ids = [{ id: 'my-page', params: { s1: 'a', s2: 'b' } }];

    expect(matchesIDs(ids, [{ id: 'my-page', segments: [''], params: {}, children: [] }])).toBe(1);
    expect(matchesIDs(ids, [{ id: 'my-page', segments: [':s1'], params: {}, children: [] }])).toBe(1);
    expect(matchesIDs(ids, [{ id: 'my-page', segments: [':s1', ':s2'], params: {}, children: [] }])).toBe(3);
    expect(matchesIDs(ids, [{ id: 'my-page', segments: [':s1', ':s2', ':s3'], params: {}, children: [] }])).toBe(1);
  })
});

describe('matchesSegments', () => {
  it('should match simple path', () => {
    const chain: RouteChain = CHAIN_3;
    expect(matchesSegments(['this'], chain)).toEqual(null);
    expect(matchesSegments(['this', 'to'], chain)).toEqual(null);
    expect(matchesSegments(['this', 'to', 'path'], chain)).toEqual(null);
    expect(matchesSegments(['this', 'to', 'path', 'segment'], chain)).toEqual(null);
    expect(matchesSegments(['this', 'to', 'path', 'segment', 'to'], chain)).toEqual(null);
    expect(matchesSegments(['this', 'to', 'path', 'segment', 'to', 'element'], chain)).toMatchChain(chain);
    expect(matchesSegments(['this', 'to', 'path', 'segment', 'to', 'element', 'more'], chain)).toEqual(null);

    expect(matchesSegments([], chain)).toEqual(null);
    expect(matchesSegments([''], chain)).toEqual(null);
    expect(matchesSegments(['path'], chain)).toEqual(null);
  });

  it('should match simple default route', () => {
    const chain: RouteChain = CHAIN_2;
    expect(matchesSegments([''], chain)).toEqual(null);
    expect(matchesSegments(['segment'], chain)).toEqual(null);
    expect(matchesSegments(['segment', 'to'], chain)).toEqual(null);
    expect(matchesSegments(['segment', 'to', 'hola'], chain)).toEqual(null);
    expect(matchesSegments(['segment', 'to', 'hola', 'adios'], chain)).toEqual(null);
    expect(matchesSegments(['segment', 'to', 'hola', 'adios', 'que'], chain)).toEqual(null);
    expect(matchesSegments(['segment', 'to', 'hola', 'adios', 'que', 'tal'], chain)).toMatchChain(chain);
    expect(matchesSegments(['segment', 'to', 'hola', 'adios', 'que', 'tal', 'more'], chain)).toMatchChain(chain);

    expect(matchesSegments(['to'], chain)).toEqual(null);
    expect(matchesSegments(['path', 'to'], chain)).toEqual(null);
  });

  it('should match simple route 2', () => {
    const chain: RouteChain = [{ id: '5', segments: ['hola'], params: undefined, children: [] }];
    expect(matchesSegments([''], chain)).toEqual(null);
    expect(matchesSegments(['hola'], chain)).toMatchChain(chain);
    expect(matchesSegments(['hola', 'hola'], chain)).toMatchChain(chain);
    expect(matchesSegments(['hola', 'adios'], chain)).toMatchChain(chain);
  });

  it('should match simple route 3', () => {
    const chain: RouteChain = [{ id: '5', segments: ['hola', 'adios'], params: undefined, children: [] }];
    expect(matchesSegments([''], chain)).toEqual(null);
    expect(matchesSegments(['hola'], chain)).toEqual(null);
    expect(matchesSegments(['hola', 'hola'], chain)).toEqual(null);
    expect(matchesSegments(['hola', 'adios'], chain)).toMatchChain(chain);
    expect(matchesSegments(['hola', 'adios', 'bye'], chain)).toMatchChain(chain);
  });

  it('should match simple route 4', () => {
    const chain: RouteChain = [
      { id: '5', segments: ['hola'], params: undefined, children: [] },
      { id: '5', segments: ['adios'], params: undefined, children: [] }];

    expect(matchesSegments([''], chain)).toEqual(null);
    expect(matchesSegments(['hola'], chain)).toEqual(null);
    expect(matchesSegments(['hola', 'hola'], chain)).toEqual(null);
    expect(matchesSegments(['hola', 'adios'], chain)).toMatchChain(chain);
  });

  it('should match with parameters', () => {
    const chain: RouteChain = [
      { id: '5', segments: ['profile', ':name'], params: undefined, children: [] },
      { id: '5', segments: [''], params: undefined, children: [] },
      { id: '5', segments: ['image'], params: { size: 'lg' }, children: [] },
      { id: '5', segments: ['image', ':size', ':type'], params: { size: 'mg' }, children: [] },
    ];
    const matched = matchesSegments(parsePath('/profile/manu/image/image/large/retina').segments, chain);
    expect(matched).toMatchChain([
      { id: '5', segments: ['profile', ':name'], params: { name: 'manu' } },
      { id: '5', segments: [''], params: undefined },
      { id: '5', segments: ['image'], params: { size: 'lg' } },
      { id: '5', segments: ['image', ':size', ':type'], params: { size: 'large', type: 'retina' } },
    ]);
  });
});

describe('findChainForSegments', () => {
  it('should match the route with higher priority', () => {
    const chain3: RouteChain = [{ id: '5', segments: ['hola'], params: undefined, children: [] }];
    const chain4: RouteChain = [
      { id: '5', segments: ['hola'], params: undefined, children: [] },
      { id: '5', segments: ['adios'], params: undefined, children: [] }];

    const routes: RouteChain[] = [
      CHAIN_1,
      CHAIN_2,
      chain3,
      chain4
    ];
    expect(findChainForSegments(['to'], routes)).toEqual(null);
    expect(findChainForSegments([''], routes)).toEqual(null);
    expect(findChainForSegments(['segment', 'to'], routes)).toEqual(null);
    expect(findChainForSegments(['hola'], routes)).toMatchChain(chain3);
    expect(findChainForSegments(['hola', 'hola'], routes)).toMatchChain(chain3);
    expect(findChainForSegments(['hola', 'adios'], routes)).toMatchChain(chain4);
  });

  it('should match the route with higher priority 2', () => {

    const chain1: RouteChain = [{ id: '1', segments: ['categories', ':category_slug'], params: undefined, children: [] }];
    const chain2: RouteChain = [{ id: '2', segments: ['workouts', ':workout_slug'], params: undefined, children: [] }];
    const chain3: RouteChain = [{ id: '3', segments: ['workouts', ':workout_slug', 'time-select'], params: undefined, children: [] }];
    const chain4: RouteChain = [{ id: '4', segments: ['workouts', ':workout_slug', 'end-workout'], params: undefined, children: [] }];
    const chain5: RouteChain = [{ id: '5', segments: ['plans'], params: undefined, children: [] }];
    const chain6: RouteChain = [{ id: '6', segments: ['custom'], params: undefined, children: [] }];
    const chain7: RouteChain = [{ id: '7', segments: ['workouts', 'list'], params: undefined, children: [] }];

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
    expect(findChainForSegments(['categories'], routes)).toEqual(null);
    expect(findChainForSegments(['workouts'], routes)).toEqual(null);

    expect(findChainForSegments(['plans'], routes)).toMatchChain(chain5);
    expect(findChainForSegments(['custom'], routes)).toMatchChain(chain6);
    expect(findChainForSegments(['workouts', 'list'], routes)).toMatchChain(chain7);

    expect(findChainForSegments(['workouts', 'hola'], routes)).toMatchChain([
      { id: '2', segments: ['workouts', ':workout_slug'], params: { 'workout_slug': 'hola' } }
    ]);

    expect(findChainForSegments(['workouts', 'hello', 'time-select'], routes)).toMatchChain([
      { id: '3', segments: ['workouts', ':workout_slug', 'time-select'], params: { 'workout_slug': 'hello' } }
    ]);
    
    expect(findChainForSegments(['workouts', 'hello2', 'end-workout'], routes)).toMatchChain([
      { id: '4', segments: ['workouts', ':workout_slug', 'end-workout'], params: { 'workout_slug': 'hello2' } }
    ]);
  });

  it('should match the default route', () => {
    const chain1: RouteChain = [
      { id: 'tabs', segments: [''], params: undefined, children: [] },
      { id: 'tab1', segments: [''], params: undefined, children: [] },
      { id: 'schedule', segments: [''], params: undefined, children: [] }
    ];
    const chain2: RouteChain = [
      { id: 'tabs', segments: [''], params: undefined, children: [] },
      { id: 'tab2', segments: ['tab2'], params: undefined, children: [] },
      { id: 'page2', segments: [''], params: undefined, children: [] }
    ];

    expect(findChainForSegments([''], [chain1])).toMatchChain(chain1);
    expect(findChainForSegments(['tab2'], [chain1])).toEqual(null);

    expect(findChainForSegments([''], [chain2])).toEqual(null);
    expect(findChainForSegments(['tab2'], [chain2])).toMatchChain(chain2);
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
  it('should initialize with empty array', () => {
    const s = new RouterSegments([]);
    expect(s.next()).toEqual('');
    expect(s.next()).toEqual('');
    expect(s.next()).toEqual('');
    expect(s.next()).toEqual('');
    expect(s.next()).toEqual('');
  });

  it('should initialize with array', () => {
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
