import { scrollToFragment } from '../utils/dom';

describe('scrollToFragment', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div class="ion-page">
        <h2 id="target">target</h2>
      </div>
    `;
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('should return false for null/undefined/empty fragment', async () => {
    expect(await scrollToFragment(undefined)).toBe(false);
    expect(await scrollToFragment('')).toBe(false);
  });

  it('should find and scroll to an existing target', async () => {
    // No ion-content here, so the function falls back to scrollIntoView. We
    // assert the truthy return (target found, scroll attempted) rather than
    // jsdom-specific scroll state.
    expect(await scrollToFragment('target')).toBe(true);
  });

  it('should not match similarly named fragments', async () => {
    // The lookup uses an exact `#id` selector, so partial/substring matches
    // must not resolve. Regression guard for any future refactor that swaps
    // the selector for fuzzy matching.
    expect(await scrollToFragment('target2')).toBe(false);
    expect(await scrollToFragment('targe')).toBe(false);
  });

  it('should return false when shouldContinue is false from the start', async () => {
    // The target exists in the DOM, so the only reason this can return false
    // is the cancellation predicate firing inside findFragmentTarget.
    expect(await scrollToFragment('target', () => false)).toBe(false);
  });

  it('should respect shouldContinue mid-poll when the target is missing', async () => {
    // Target is not in the DOM; findFragmentTarget enters its poll loop.
    // shouldContinue flips false on the third call, which must abort the loop.
    let calls = 0;
    const result = await scrollToFragment('missing', () => ++calls <= 2);
    expect(result).toBe(false);
    expect(calls).toBeGreaterThan(2);
  });

  it('should not call shouldContinue after returning early on null fragment', async () => {
    let calls = 0;
    await scrollToFragment(undefined, () => {
      calls++;
      return true;
    });
    expect(calls).toBe(0);
  });

  it('should reject a target whose ancestor is .ion-page-hidden', async () => {
    // Back-stack pages stay in the DOM with `.ion-page-hidden`. A target
    // matched only on a hidden page must not win.
    document.body.innerHTML = `
      <div class="ion-page ion-page-hidden">
        <h2 id="stale">stale</h2>
      </div>
    `;
    expect(await scrollToFragment('stale')).toBe(false);
  });

  it('should reject a target whose ancestor is .tab-hidden', async () => {
    // Inactive `ion-tab` elements carry `.ion-page` but use `.tab-hidden`
    // (not `.ion-page-hidden`). A target inside an inactive tab must not win;
    // a naive "last `.ion-page:not(.ion-page-hidden)`" pick would otherwise
    // land on it.
    document.body.innerHTML = `
      <div class="ion-page tab-hidden">
        <h2 id="in-inactive-tab">stale</h2>
      </div>
    `;
    expect(await scrollToFragment('in-inactive-tab')).toBe(false);
  });

  it('should accept a target inside a sibling non-hidden ion-page', async () => {
    // During transitions multiple `.ion-page` elements may briefly coexist
    // without `.ion-page-hidden`. A target inside any non-hidden page must
    // still resolve.
    document.body.innerHTML = `
      <div class="ion-page ion-page-hidden">
        <h2 id="lookup">in hidden page</h2>
      </div>
      <div class="ion-page">
        <h2 id="other">other</h2>
      </div>
    `;
    // Lookup of 'other' must succeed even though a hidden sibling page exists.
    expect(await scrollToFragment('other')).toBe(true);
  });
});
