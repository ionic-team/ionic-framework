import type { RouteChain } from '../utils/interface';
import {
  RouterSegments,
  matchesIDs,
  matchesSegments,
  matchesRedirect,
  mergeParams,
  findChainForSegments,
} from '../utils/matching';
import { parsePath } from '../utils/path';

const CHAIN_1: RouteChain = [
  { id: '2', segments: ['to'], params: undefined },
  { id: '1', segments: ['path'], params: undefined },
  { id: '3', segments: ['segment'], params: undefined },
  { id: '4', segments: [''], params: undefined },
];

const CHAIN_2: RouteChain = [
  { id: '2', segments: [''], params: undefined },
  { id: '1', segments: [''], params: undefined },
  { id: '3', segments: ['segment', 'to'], params: undefined },
  { id: '4', segments: [''], params: undefined },
  { id: '5', segments: ['hola'], params: undefined },
  { id: '6', segments: [''], params: undefined },
  { id: '7', segments: [''], params: undefined },
  { id: '8', segments: ['adios', 'que', 'tal'], params: undefined },
];

const CHAIN_3: RouteChain = [
  { id: '2', segments: ['this', 'to'], params: undefined },
  { id: '1', segments: ['path'], params: undefined },
  { id: '3', segments: ['segment', 'to', 'element'], params: undefined },
  { id: '4', segments: [''], params: undefined },
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

    expect(matchesIDs(ids, [{ id: 'my-page', segments: [''], params: {} }])).toBe(1);
    expect(matchesIDs(ids, [{ id: 'my-page', segments: [':s1'], params: {} }])).toBe(1);
    expect(matchesIDs(ids, [{ id: 'my-page', segments: [':s1', ':s2'], params: {} }])).toBe(3);
    expect(matchesIDs(ids, [{ id: 'my-page', segments: [':s1', ':s2', ':s3'], params: {} }])).toBe(1);
  });
});

describe('matchesSegments', () => {
  it('should match simple path', () => {
    const chain: RouteChain = CHAIN_3;
    expect(matchesSegments(['this'], chain)).toEqual(null);
    expect(matchesSegments(['this', 'to'], chain)).toEqual(null);
    expect(matchesSegments(['this', 'to', 'path'], chain)).toEqual(null);
    expect(matchesSegments(['this', 'to', 'path', 'segment'], chain)).toEqual(null);
    expect(matchesSegments(['this', 'to', 'path', 'segment', 'to'], chain)).toEqual(null);
    expect(matchesSegments(['this', 'to', 'path', 'segment', 'to', 'element'], chain)).toEqual(chain);
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
    expect(matchesSegments(['segment', 'to', 'hola', 'adios', 'que', 'tal'], chain)).toEqual(chain);
    expect(matchesSegments(['segment', 'to', 'hola', 'adios', 'que', 'tal', 'more'], chain)).toEqual(chain);

    expect(matchesSegments(['to'], chain)).toEqual(null);
    expect(matchesSegments(['path', 'to'], chain)).toEqual(null);
  });

  it('should match simple route 2', () => {
    const chain: RouteChain = [{ id: '5', segments: ['hola'], params: undefined }];
    expect(matchesSegments([''], chain)).toEqual(null);
    expect(matchesSegments(['hola'], chain)).toEqual(chain);
    expect(matchesSegments(['hola', 'hola'], chain)).toEqual(chain);
    expect(matchesSegments(['hola', 'adios'], chain)).toEqual(chain);
  });

  it('should match simple route 3', () => {
    const chain: RouteChain = [{ id: '5', segments: ['hola', 'adios'], params: undefined }];
    expect(matchesSegments([''], chain)).toEqual(null);
    expect(matchesSegments(['hola'], chain)).toEqual(null);
    expect(matchesSegments(['hola', 'hola'], chain)).toEqual(null);
    expect(matchesSegments(['hola', 'adios'], chain)).toEqual(chain);
    expect(matchesSegments(['hola', 'adios', 'bye'], chain)).toEqual(chain);
  });

  it('should match simple route 4', () => {
    const chain: RouteChain = [
      { id: '5', segments: ['hola'], params: undefined },
      { id: '5', segments: ['adios'], params: undefined },
    ];

    expect(matchesSegments([''], chain)).toEqual(null);
    expect(matchesSegments(['hola'], chain)).toEqual(null);
    expect(matchesSegments(['hola', 'hola'], chain)).toEqual(null);
    expect(matchesSegments(['hola', 'adios'], chain)).toEqual(chain);
  });

  it('should match with parameters', () => {
    const chain: RouteChain = [
      { id: '5', segments: ['profile', ':name'], params: undefined },
      { id: '5', segments: [''], params: undefined },
      { id: '5', segments: ['image'], params: { size: 'lg' } },
      { id: '5', segments: ['image', ':size', ':type'], params: { size: 'mg' } },
    ];
    const matched = matchesSegments(parsePath('/profile/manu/image/image/large/retina').segments, chain);
    expect(matched).toEqual([
      { id: '5', segments: ['profile', ':name'], params: { name: 'manu' } },
      { id: '5', segments: [''], params: undefined },
      { id: '5', segments: ['image'], params: { size: 'lg' } },
      { id: '5', segments: ['image', ':size', ':type'], params: { size: 'large', type: 'retina' } },
    ]);
  });
});

describe('findChainForSegments', () => {
  it('should match the route with higher priority', () => {
    const chain3: RouteChain = [{ id: '5', segments: ['hola'], params: undefined }];
    const chain4: RouteChain = [
      { id: '5', segments: ['hola'], params: undefined },
      { id: '5', segments: ['adios'], params: undefined },
    ];

    const routes: RouteChain[] = [CHAIN_1, CHAIN_2, chain3, chain4];
    expect(findChainForSegments(['to'], routes)).toEqual(null);
    expect(findChainForSegments([''], routes)).toEqual(null);
    expect(findChainForSegments(['segment', 'to'], routes)).toEqual(null);
    expect(findChainForSegments(['hola'], routes)).toEqual(chain3);
    expect(findChainForSegments(['hola', 'hola'], routes)).toEqual(chain3);
    expect(findChainForSegments(['hola', 'adios'], routes)).toEqual(chain4);
  });

  it('should match the route with higher priority 2', () => {
    const chain1: RouteChain = [{ id: '1', segments: ['categories', ':category_slug'], params: undefined }];
    const chain2: RouteChain = [{ id: '2', segments: ['workouts', ':workout_slug'], params: undefined }];
    const chain3: RouteChain = [{ id: '3', segments: ['workouts', ':workout_slug', 'time-select'], params: undefined }];
    const chain4: RouteChain = [{ id: '4', segments: ['workouts', ':workout_slug', 'end-workout'], params: undefined }];
    const chain5: RouteChain = [{ id: '5', segments: ['plans'], params: undefined }];
    const chain6: RouteChain = [{ id: '6', segments: ['custom'], params: undefined }];
    const chain7: RouteChain = [{ id: '7', segments: ['workouts', 'list'], params: undefined }];

    const routes: RouteChain[] = [chain1, chain2, chain3, chain4, chain5, chain6, chain7];
    // no match
    expect(findChainForSegments(['categories'], routes)).toEqual(null);
    expect(findChainForSegments(['workouts'], routes)).toEqual(null);

    expect(findChainForSegments(['plans'], routes)).toEqual(chain5);
    expect(findChainForSegments(['custom'], routes)).toEqual(chain6);
    expect(findChainForSegments(['workouts', 'list'], routes)).toEqual(chain7);

    expect(findChainForSegments(['workouts', 'hola'], routes)).toEqual([
      { id: '2', segments: ['workouts', ':workout_slug'], params: { workout_slug: 'hola' } },
    ]);
    expect(findChainForSegments(['workouts', 'hello', 'time-select'], routes)).toEqual([
      { id: '3', segments: ['workouts', ':workout_slug', 'time-select'], params: { workout_slug: 'hello' } },
    ]);
    expect(findChainForSegments(['workouts', 'hello2', 'end-workout'], routes)).toEqual([
      { id: '4', segments: ['workouts', ':workout_slug', 'end-workout'], params: { workout_slug: 'hello2' } },
    ]);
  });

  it('should match the default route', () => {
    const chain1: RouteChain = [
      { id: 'tabs', segments: [''], params: undefined },
      { id: 'tab1', segments: [''], params: undefined },
      { id: 'schedule', segments: [''], params: undefined },
    ];
    const chain2: RouteChain = [
      { id: 'tabs', segments: [''], params: undefined },
      { id: 'tab2', segments: ['tab2'], params: undefined },
      { id: 'page2', segments: [''], params: undefined },
    ];

    expect(findChainForSegments([''], [chain1])).toEqual(chain1);
    expect(findChainForSegments(['tab2'], [chain1])).toEqual(null);

    expect(findChainForSegments([''], [chain2])).toEqual(null);
    expect(findChainForSegments(['tab2'], [chain2])).toEqual(chain2);
  });
});

describe('mergeParams', () => {
  it('should merge undefined', () => {
    expect(mergeParams(undefined, undefined)).toBeUndefined();
    expect(mergeParams(null as any, undefined)).toBeUndefined();
    expect(mergeParams(undefined, null as any)).toBeUndefined();
    expect(mergeParams(null as any, null as any)).toBeUndefined();
  });

  it('should merge undefined with params', () => {
    const params = { data: '1' };
    expect(mergeParams(undefined, params)).toEqual(params);
    expect(mergeParams(null as any, params)).toEqual(params);
    expect(mergeParams(params, undefined)).toEqual(params);
    expect(mergeParams(params, null as any)).toEqual(params);
  });

  it('should merge params with params', () => {
    const params1 = { data: '1', data3: 'hello' };
    const params2 = { data: '2', data2: 'hola' };

    expect(mergeParams(params1, params2)).toEqual({
      data: '2',
      data2: 'hola',
      data3: 'hello',
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
    expect(matchesRedirect([''], { from: [''], to: { segments: [''] } })).toBeTruthy();
    expect(matchesRedirect([''], { from: ['*'], to: { segments: [''] } })).toBeTruthy();

    expect(matchesRedirect([''], { from: ['hola'], to: { segments: [] } })).toBeFalsy();
    expect(matchesRedirect([''], { from: ['hola', '*'], to: { segments: [''] } })).toBeFalsy();
  });

  it('should match simple segment redirect', () => {
    expect(matchesRedirect(['workouts'], { from: ['workouts'], to: { segments: [''] } })).toBeTruthy();
    expect(matchesRedirect(['workouts'], { from: ['*'], to: { segments: [''] } })).toBeTruthy();
    expect(matchesRedirect(['workouts', 'hola'], { from: ['workouts', '*'], to: { segments: [''] } })).toBeTruthy();
    expect(matchesRedirect(['workouts', 'hola'], { from: ['workouts', 'hola'], to: { segments: [''] } })).toBeTruthy();

    expect(matchesRedirect(['workouts'], { from: ['workouts', '*'], to: { segments: [''] } })).toBeFalsy();
    expect(matchesRedirect(['workouts', 'hola'], { from: ['workouts'], to: { segments: [''] } })).toBeFalsy();
    expect(matchesRedirect(['workouts', 'hola'], { from: ['workouts', 'adios'], to: { segments: [''] } })).toBeFalsy();
  });

  it('should match long route', () => {
    expect(matchesRedirect(['workouts', 'path', 'to'], { from: ['*'], to: { segments: [''] } })).toBeTruthy();
    expect(
      matchesRedirect(['workouts', 'path', 'to'], { from: ['workouts', '*'], to: { segments: [''] } })
    ).toBeTruthy();
    expect(
      matchesRedirect(['workouts', 'path', 'to'], { from: ['workouts', 'path', '*'], to: { segments: [''] } })
    ).toBeTruthy();
    expect(
      matchesRedirect(['workouts', 'path', 'to'], { from: ['workouts', 'path', 'to'], to: { segments: [''] } })
    ).toBeTruthy();

    expect(matchesRedirect(['workouts', 'path', 'to'], { from: ['login'], to: { segments: [''] } })).toBeFalsy();
    expect(matchesRedirect(['workouts', 'path', 'to'], { from: ['login', '*'], to: { segments: [''] } })).toBeFalsy();
    expect(matchesRedirect(['workouts', 'path', 'to'], { from: ['workouts'], to: { segments: [''] } })).toBeFalsy();
    expect(
      matchesRedirect(['workouts', 'path', 'to'], { from: ['workouts', 'path'], to: { segments: [''] } })
    ).toBeFalsy();
    expect(
      matchesRedirect(['workouts', 'path', 'to'], { from: ['workouts', 'path', 'to', '*'], to: { segments: [''] } })
    ).toBeFalsy();
  });

  it('should not match undefined "to"', () => {
    expect(matchesRedirect(['workouts', 'path', 'to'], { from: ['*'], to: undefined })).toBeFalsy();
    expect(matchesRedirect(['workouts', 'path', 'to'], { from: ['workouts', '*'], to: undefined })).toBeFalsy();
    expect(matchesRedirect(['workouts', 'path', 'to'], { from: ['workouts', 'path', '*'], to: undefined })).toBeFalsy();
    expect(
      matchesRedirect(['workouts', 'path', 'to'], { from: ['workouts', 'path', 'to'], to: undefined })
    ).toBeFalsy();
  });
});
