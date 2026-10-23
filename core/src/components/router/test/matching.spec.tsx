import type { RouteChain } from '../utils/interface';
import {
  RouterSegments,
  matchesIDs,
  matchesSegments,
  matchesRedirect,
  mergeParams,
  findChainForSegments,
  findChainForIDs,
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

describe('wildcard routes', () => {
  const NOT_FOUND: RouteChain = [{ id: 'not-found', segments: ['*'], params: undefined }];

  it('should match any depth and expose the matched path', () => {
    expect(matchesSegments(['a'], NOT_FOUND)).toEqual([
      { id: 'not-found', segments: ['*'], params: { pathMatch: 'a' } },
    ]);
    expect(matchesSegments(['a', 'b', 'c'], NOT_FOUND)).toEqual([
      { id: 'not-found', segments: ['*'], params: { pathMatch: 'a/b/c' } },
    ]);
  });

  it('should match the root path', () => {
    expect(matchesSegments([''], NOT_FOUND)).toEqual([{ id: 'not-found', segments: ['*'], params: { pathMatch: '' } }]);
  });

  it('should match after a fixed prefix', () => {
    const chain: RouteChain = [{ id: 'admin', segments: ['admin', '*'], params: { role: 'owner' } }];
    expect(matchesSegments(['admin'], chain)).toEqual([
      { id: 'admin', segments: ['admin', '*'], params: { role: 'owner', pathMatch: '' } },
    ]);
    expect(matchesSegments(['admin', 'users', '1'], chain)).toEqual([
      { id: 'admin', segments: ['admin', '*'], params: { role: 'owner', pathMatch: 'users/1' } },
    ]);
    expect(matchesSegments(['users'], chain)).toEqual(null);
  });

  it('should match a wildcard nested under a default route', () => {
    const chain: RouteChain = [
      { id: 'tabs', segments: [''], params: undefined },
      { id: 'not-found', segments: ['*'], params: undefined },
    ];
    expect(matchesSegments(['a', 'b'], chain)).toEqual([
      { id: 'tabs', segments: [''], params: undefined },
      { id: 'not-found', segments: ['*'], params: { pathMatch: 'a/b' } },
    ]);
  });

  it('should let the children of a parent wildcard match the rest of the path', () => {
    const chain: RouteChain = [
      { id: 'admin', segments: ['admin', '*'], params: undefined },
      { id: 'users', segments: ['users'], params: undefined },
    ];
    expect(matchesSegments(['admin', 'users'], chain)).toEqual(chain);
    expect(matchesSegments(['admin', 'posts'], chain)).toEqual(null);
  });

  it('should match a wildcard nested under a parent wildcard', () => {
    const chain: RouteChain = [
      { id: 'parent', segments: ['*'], params: undefined },
      { id: 'not-found', segments: ['*'], params: undefined },
    ];
    expect(findChainForSegments(['x', 'y'], [chain])).toEqual([
      { id: 'parent', segments: ['*'], params: undefined },
      { id: 'not-found', segments: ['*'], params: { pathMatch: 'x/y' } },
    ]);
  });

  it('should match a mid-path * literally', () => {
    const chain: RouteChain = [{ id: '1', segments: ['a', '*', 'b'], params: undefined }];
    expect(matchesSegments(['a', '*', 'b'], chain)).toEqual(chain);
    expect(matchesSegments(['a', 'x', 'b'], chain)).toEqual(null);
  });

  it('should lose to default, fixed and parameter routes on a single segment path', () => {
    const home: RouteChain = [{ id: 'home', segments: [''], params: undefined }];
    const foo: RouteChain = [{ id: 'foo', segments: ['foo'], params: undefined }];
    const param: RouteChain = [{ id: 'param', segments: [':id'], params: undefined }];
    const routes = [NOT_FOUND, home, foo];

    expect(findChainForSegments([''], routes)![0].id).toEqual('home');
    expect(findChainForSegments(['foo'], routes)![0].id).toEqual('foo');
    expect(findChainForSegments(['bar'], routes)![0].id).toEqual('not-found');
    expect(findChainForSegments(['bar'], [NOT_FOUND, param])![0].id).toEqual('param');
  });

  it('should win over a route that ignored trailing segments', () => {
    const admin: RouteChain = [{ id: 'admin', segments: ['admin'], params: undefined }];
    const adminNotFound: RouteChain = [{ id: 'admin-not-found', segments: ['admin', '*'], params: undefined }];

    expect(findChainForSegments(['admin'], [admin, adminNotFound, NOT_FOUND])![0].id).toEqual('admin');
    expect(findChainForSegments(['admin', 'users', '1'], [admin, adminNotFound, NOT_FOUND])).toEqual([
      { id: 'admin-not-found', segments: ['admin', '*'], params: { pathMatch: 'users/1' } },
    ]);
    expect(findChainForSegments(['admin', 'users'], [admin, NOT_FOUND])![0].id).toEqual('not-found');
  });

  it('should lose to a route that matched the whole path', () => {
    const profile: RouteChain = [{ id: 'profile', segments: ['settings', 'profile'], params: undefined }];
    const item: RouteChain = [{ id: 'item', segments: ['settings', ':section', ':item'], params: undefined }];

    expect(findChainForSegments(['settings', 'profile', 'avatar'], [profile, item, NOT_FOUND])).toEqual([
      { id: 'item', segments: ['settings', ':section', ':item'], params: { section: 'profile', item: 'avatar' } },
    ]);
    // Without the wildcard, the route that ignored a trailing segment still wins
    expect(findChainForSegments(['settings', 'profile', 'avatar'], [profile, item])![0].id).toEqual('profile');
  });

  it('should not change how routes without a wildcard match trailing segments', () => {
    const admin: RouteChain = [{ id: 'admin', segments: ['admin'], params: undefined }];
    expect(findChainForSegments(['admin', 'users'], [admin])![0].id).toEqual('admin');
  });

  it('should win over parameter routes with fewer fixed segments and lose to ones with as many', () => {
    const admin: RouteChain = [{ id: 'admin', segments: ['admin', '*'], params: undefined }];
    const section: RouteChain = [{ id: 'section', segments: [':section', ':id'], params: undefined }];
    const adminId: RouteChain = [{ id: 'admin-id', segments: ['admin', ':id'], params: undefined }];

    expect(findChainForSegments(['admin', 'users'], [section, admin])![0].id).toEqual('admin');
    expect(findChainForSegments(['admin', 'users'], [admin, adminId])![0].id).toEqual('admin-id');
    expect(findChainForSegments(['admin', 'users'], [adminId, admin])![0].id).toEqual('admin-id');
  });

  it('should lose to a parameter route with the same fixed segments when nested under default routes', () => {
    const docsNotFound: RouteChain = [
      { id: 'tabs', segments: [''], params: undefined },
      { id: 'tab-docs', segments: ['docs'], params: undefined },
      { id: 'docs-not-found', segments: ['*'], params: undefined },
    ];
    const docDetail: RouteChain = [{ id: 'doc-detail', segments: ['docs', ':id'], params: undefined }];

    expect(findChainForSegments(['docs', 'abc'], [docsNotFound, docDetail])![0].id).toEqual('doc-detail');
    expect(findChainForSegments(['docs', 'abc', 'def'], [docsNotFound, docDetail])![2].id).toEqual('docs-not-found');
  });

  it('should rank routes without a wildcard by priority', () => {
    const user: RouteChain = [{ id: 'user', segments: ['users', ':id'], params: undefined }];
    const me: RouteChain = [{ id: 'me', segments: ['users', 'me'], params: undefined }];

    expect(findChainForSegments(['users', 'me'], [user, me, NOT_FOUND])![0].id).toEqual('me');
    expect(findChainForSegments(['users', 'me'], [me, user, NOT_FOUND])![0].id).toEqual('me');
  });

  it('should rank wildcard routes with as many fixed segments by priority, ignoring the wildcard', () => {
    const deep: RouteChain = [{ id: 'deep', segments: [':a', ':b', '*'], params: undefined }];
    const nested: RouteChain = [
      { id: 'tabs', segments: [''], params: undefined },
      { id: 'tab', segments: [''], params: undefined },
      { id: 'shallow', segments: [':a', '*'], params: undefined },
    ];

    expect(findChainForSegments(['x', 'y'], [nested, deep])![0].id).toEqual('deep');
    expect(findChainForSegments(['x', 'y'], [deep, nested])![0].id).toEqual('deep');
  });

  it('should fall back to the best full match in any declaration order when one has as many fixed segments', () => {
    const admin: RouteChain = [{ id: 'admin', segments: ['admin', 'users', '*'], params: undefined }];
    const user: RouteChain = [{ id: 'user', segments: ['admin', 'users', ':id'], params: undefined }];
    const settings: RouteChain = [{ id: 'settings', segments: [':org', ':team', 'settings'], params: undefined }];
    const path = ['admin', 'users', 'settings'];

    expect(findChainForSegments(path, [admin, user, settings])![0].id).toEqual('settings');
    expect(findChainForSegments(path, [settings, user, admin])![0].id).toEqual('settings');
    expect(findChainForSegments(path, [admin, settings, user])![0].id).toEqual('settings');
  });

  it('should prefer the wildcard with more fixed segments over one with a higher priority', () => {
    const nested: RouteChain = [
      { id: 'tabs', segments: [''], params: undefined },
      { id: 'tab', segments: [''], params: undefined },
      { id: 'docs', segments: ['docs'], params: undefined },
      { id: 'docs-not-found', segments: ['*'], params: undefined },
    ];
    const guide: RouteChain = [{ id: 'guide-not-found', segments: ['docs', 'guide', '*'], params: undefined }];
    const sub: RouteChain = [{ id: 'sub', segments: ['docs', ':id', ':sub'], params: undefined }];

    expect(findChainForSegments(['docs', 'guide', 'x'], [nested, guide, sub])![0].id).toEqual('guide-not-found');
    expect(findChainForSegments(['docs', 'guide', 'x'], [sub, guide, nested])![0].id).toEqual('guide-not-found');
  });

  it('should prefer the wildcard with the most fixed segments', () => {
    const admin: RouteChain = [{ id: 'admin', segments: ['admin', '*'], params: undefined }];
    expect(findChainForSegments(['admin', 'x'], [NOT_FOUND, admin])![0].id).toEqual('admin');
    expect(findChainForSegments(['other', 'x'], [NOT_FOUND, admin])![0].id).toEqual('not-found');
  });
});

describe('findChainForIDs', () => {
  it('should prefer a route over a wildcard route on a tie regardless of declaration order', () => {
    const notFound: RouteChain = [
      { id: 'tabs', segments: [''], params: undefined },
      { id: 'docs-not-found', segments: ['*'], params: undefined },
    ];
    const index: RouteChain = [
      { id: 'tabs', segments: [''], params: undefined },
      { id: 'docs-index', segments: [''], params: undefined },
    ];
    const ids = [{ id: 'tabs', element: undefined }];

    expect(findChainForIDs(ids, [notFound, index])![1].id).toEqual('docs-index');
    expect(findChainForIDs(ids, [index, notFound])![1].id).toEqual('docs-index');
  });

  it('should keep a wildcard route on a tie when the other route is missing a parameter', () => {
    const notFound: RouteChain = [
      { id: 'tabs', segments: [''], params: undefined },
      { id: 'docs-not-found', segments: ['*'], params: undefined },
    ];
    const slug: RouteChain = [
      { id: 'tabs', segments: [''], params: undefined },
      { id: 'doc-page', segments: [':slug'], params: undefined },
    ];
    const ids = [{ id: 'tabs', element: undefined }];

    expect(findChainForIDs(ids, [notFound, slug])![1].id).toEqual('docs-not-found');
    expect(findChainForIDs(ids, [slug, notFound])![1].id).toEqual('docs-not-found');
  });

  it('should prefer a route over a wildcard route on a tie when the outlet reports its parameter', () => {
    const notFound: RouteChain = [
      { id: 'docs', segments: ['docs'], params: undefined },
      { id: 'doc-page', segments: ['*'], params: undefined },
    ];
    const view: RouteChain = [
      { id: 'docs', segments: ['docs'], params: undefined },
      { id: 'doc-page', segments: ['view', ':slug'], params: undefined },
    ];
    const ids = [
      { id: 'docs', element: undefined },
      { id: 'doc-page', element: undefined, params: { slug: 'a' } },
    ];

    expect(findChainForIDs(ids, [notFound, view])).toEqual([
      { id: 'docs', segments: ['docs'], params: undefined },
      { id: 'doc-page', segments: ['view', ':slug'], params: { slug: 'a' } },
    ]);
  });

  it('should prefer a route that can build a url, then a wildcard route, in any declaration order', () => {
    const tabs = { id: 'tabs', segments: [''], params: undefined };
    const slug: RouteChain = [tabs, { id: 'doc-page', segments: [':slug'], params: undefined }];
    const index: RouteChain = [tabs, { id: 'docs-index', segments: [''], params: undefined }];
    const notFound: RouteChain = [tabs, { id: 'docs-not-found', segments: ['*'], params: undefined }];
    const ids = [{ id: 'tabs', element: undefined }];

    expect(findChainForIDs(ids, [slug, index, notFound])![1].id).toEqual('docs-index');
    expect(findChainForIDs(ids, [slug, notFound, index])![1].id).toEqual('docs-index');
    expect(findChainForIDs(ids, [notFound, slug, index])![1].id).toEqual('docs-index');
  });

  it('should keep the first route declared on a tie without a wildcard route', () => {
    const tabs = { id: 'tabs', segments: [''], params: undefined };
    const slug: RouteChain = [tabs, { id: 'doc-page', segments: [':slug'], params: undefined }];
    const index: RouteChain = [tabs, { id: 'docs-index', segments: [''], params: undefined }];
    const ids = [{ id: 'tabs', element: undefined }];

    expect(findChainForIDs(ids, [slug, index])![1].id).toEqual('doc-page');
  });

  it('should prefer a wildcard route when the outlet reports the matched path', () => {
    const index: RouteChain = [
      { id: 'docs', segments: ['docs'], params: undefined },
      { id: 'doc-page', segments: [''], params: undefined },
    ];
    const slug: RouteChain = [
      { id: 'docs', segments: ['docs'], params: undefined },
      { id: 'doc-page', segments: [':slug'], params: undefined },
    ];
    const notFound: RouteChain = [
      { id: 'docs', segments: ['docs'], params: undefined },
      { id: 'doc-page', segments: ['*'], params: undefined },
    ];
    const ids = [
      { id: 'docs', element: undefined },
      { id: 'doc-page', element: undefined, params: { pathMatch: 'a/b' } },
    ];

    expect(findChainForIDs(ids, [index, notFound])![1].segments).toEqual(['*']);
    expect(findChainForIDs(ids, [slug, notFound])![1].segments).toEqual(['*']);
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

  it('should return the non empty remaining segments', () => {
    const s = new RouterSegments(['a', '', 'b', '', 'c']);
    expect(s.next()).toEqual('a');
    expect(s.rest()).toEqual(['b', 'c']);
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
