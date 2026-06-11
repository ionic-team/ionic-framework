import { expect } from '@playwright/test';
import type { E2EPage } from '@utils/test/playwright';
import { configs, test } from '@utils/test/playwright';

/**
 * Waits until `page-two`'s `ion-content` has scrolled past the fixture's 2000px
 * spacer. The anchor target sits below the spacer, so a successful fragment
 * scroll must move `scrollTop` well past it; a regression that scrolled by
 * only a handful of pixels would fail this threshold.
 */
const waitForAnchorScrolled = (page: E2EPage) =>
  page.waitForFunction(async () => {
    const content = document.querySelector('page-two ion-content') as HTMLIonContentElement | null;
    if (!content) return false;
    const scrollEl = await content.getScrollElement();
    return scrollEl.scrollTop > 1500;
  });

/**
 * This behavior does not vary across modes/directions.
 */
configs({ modes: ['ios'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('router: redirect'), () => {
    test('contains query parameters after redirect', async ({ page }) => {
      await page.goto(`/src/components/router/test/basic#/redirect-to-three`, config);

      expect(page.url()).toContain('#/three?has_query_string=true');
    });
  });

  test.describe(title('router: push'), () => {
    test('should support relative path', async ({ page }) => {
      await page.goto(`/src/components/router/test/basic#/two/three/hola`, config);
      await page.click('#btn-rel');

      expect(page.url()).toContain('#/two/three/relative?param=1');
    });

    test('should support absolute path', async ({ page }) => {
      await page.goto(`/src/components/router/test/basic#/two/three/hola`, config);
      await page.click('#btn-abs');

      expect(page.url()).toContain('#/two/three/absolute');
    });

    test('should route when ion-router-link href contains a fragment', async ({ page }, testInfo) => {
      testInfo.annotations.push({
        type: 'issue',
        description: 'https://github.com/ionic-team/ionic-framework/issues/19365',
      });
      const errors: string[] = [];
      page.on('pageerror', (e) => errors.push(e.message));
      page.on('console', (msg) => {
        if (msg.type() === 'error') errors.push(msg.text());
      });

      await page.goto(`/src/components/router/test/basic#/two`, config);
      await page.click('#link-with-fragment');

      await expect(page.locator('page-two')).toBeVisible();
      expect(page.url()).toContain('#/two/second-page#anchor');
      expect(errors.filter((m) => m.includes('not part of the routing set'))).toEqual([]);
    });

    test('should route when ion-router-link href contains both query and fragment', async ({ page }, testInfo) => {
      testInfo.annotations.push({
        type: 'issue',
        description: 'https://github.com/ionic-team/ionic-framework/issues/19365',
      });
      await page.goto(`/src/components/router/test/basic#/two`, config);
      await page.click('#link-with-query-and-fragment');

      await expect(page.locator('page-three')).toBeVisible();
      expect(page.url()).toContain('#/two/three/hola?flag=true#anchor');
    });

    test('should preserve the fragment when push() resolves a relative path', async ({ page }, testInfo) => {
      testInfo.annotations.push({
        type: 'issue',
        description: 'https://github.com/ionic-team/ionic-framework/issues/19365',
      });
      await page.goto(`/src/components/router/test/basic#/two/three/hola`, config);
      await page.click('#btn-rel-with-fragment');

      expect(page.url()).toContain('#/two/three/relative#anchor');
    });

    test('should scroll to the fragment target after navigating', async ({ page }, testInfo) => {
      testInfo.annotations.push({
        type: 'issue',
        description: 'https://github.com/ionic-team/ionic-framework/issues/19365',
      });
      await page.goto(`/src/components/router/test/basic#/two`, config);
      await page.click('#link-with-fragment');

      await expect(page.locator('page-two #anchor')).toBeVisible();
      await waitForAnchorScrolled(page);
    });

    test('should scroll to the fragment target on initial deep-link load', async ({ page }, testInfo) => {
      testInfo.annotations.push({
        type: 'issue',
        description: 'https://github.com/ionic-team/ionic-framework/issues/19365',
      });
      // Land on the fixture without a fragment first so the test helper can
      // attach its query params (it appends them after the hash, which would
      // otherwise pollute the fragment). Once loaded we replaceState to a URL
      // that includes the fragment, then reload to simulate a true cold open.
      await page.goto(`/src/components/router/test/basic#/two`, config);
      await page.evaluate(() => {
        const { origin, pathname, search } = window.location;
        window.history.replaceState({}, '', `${origin}${pathname}${search}#/two/second-page#anchor`);
      });
      await page.reload();

      await expect(page.locator('page-two #anchor')).toBeVisible();
      await waitForAnchorScrolled(page);
    });

    test('should scroll on deep-link load even when an inactive tab has hydrated', async ({ page }, testInfo) => {
      testInfo.annotations.push({
        type: 'issue',
        description: 'https://github.com/ionic-team/ionic-framework/issues/19365',
      });
      // Inactive `ion-tab` elements carry `.ion-page` but use `.tab-hidden`
      // instead of `.ion-page-hidden`. The fixture's inline `tab-four` is one
      // such sibling. Waiting for it to hydrate before reload makes the
      // active-page lookup deterministic across runs.
      await page.goto(`/src/components/router/test/basic#/two`, config);
      await page.waitForFunction(() => !!document.querySelector('ion-tab[tab="tab-four"].hydrated'));
      await page.evaluate(() => {
        const { origin, pathname, search } = window.location;
        window.history.replaceState({}, '', `${origin}${pathname}${search}#/two/second-page#anchor`);
      });
      await page.reload();
      await page.waitForFunction(() => !!document.querySelector('ion-tab[tab="tab-four"].hydrated'));

      await expect(page.locator('page-two #anchor')).toBeVisible();
      await waitForAnchorScrolled(page);
    });

    test('should scope the fragment lookup to the active page', async ({ page }, testInfo) => {
      testInfo.annotations.push({
        type: 'issue',
        description: 'https://github.com/ionic-team/ionic-framework/issues/19365',
      });
      // page-one and page-two both expose `id="anchor"`. page-one is kept in
      // the DOM as `.ion-page-hidden` after the push; a document-wide
      // `getElementById` would return its anchor first. The router must scope
      // the lookup to the active page so page-two's anchor wins.
      await page.goto(`/src/components/router/test/basic#/two`, config);
      await page.click('#link-with-fragment');

      await expect(page.locator('page-two #anchor')).toBeVisible();
      await waitForAnchorScrolled(page);

      // page-one is still in the DOM but should not have been scrolled.
      const pageOneScrollTop = await page.evaluate(async () => {
        const content = document.querySelector('page-one ion-content') as HTMLIonContentElement | null;
        if (!content) return 0;
        const scrollEl = await content.getScrollElement();
        return scrollEl.scrollTop;
      });
      expect(pageOneScrollTop).toBeLessThan(100);
    });

    test('should drop a stale fragment when navChanged fires for a different path', async ({ page }, testInfo) => {
      testInfo.annotations.push({
        type: 'issue',
        description: 'https://github.com/ionic-team/ionic-framework/issues/19365',
      });
      // Land on a URL with a fragment, then trigger a tab switch. The tab
      // outlet emits `navChanged` for the new path; the fragment referred to
      // an anchor on the previous page and must not survive the rewrite.
      await page.goto(`/src/components/router/test/basic#/two/second-page#anchor`, config);
      await expect(page.locator('page-two')).toBeVisible();

      await page.click('#tab-button-tab-one');

      await expect(page.locator('tab-one')).toBeVisible();
      await page.waitForFunction(() => !window.location.hash.includes('#anchor'));
      expect(page.url()).not.toContain('#anchor');
    });

    test('should cancel an in-flight fragment scroll when a newer navigation supersedes it', async ({
      page,
    }, testInfo) => {
      testInfo.annotations.push({
        type: 'issue',
        description: 'https://github.com/ionic-team/ionic-framework/issues/19365',
      });
      // Two rapid pushes: the first targets a fragment (begins polling +
      // smooth scroll), the second arrives before the first lands and clears
      // the fragment. The cancellation token must abort the first scroll so
      // we end up at the top of the page, not parked at #anchor.
      await page.goto(`/src/components/router/test/basic#/two`, config);
      await expect(page.locator('page-one')).toBeVisible();

      await page.evaluate(async () => {
        const router = document.querySelector('ion-router') as HTMLIonRouterElement;
        router.push('/two/second-page#anchor');
        await router.push('/two/second-page');
      });

      await expect(page.locator('page-two')).toBeVisible();
      // Wait for page-two's scrollTop to stabilise across two consecutive
      // frames. A scroll triggered by the un-cancelled first push would
      // still be animating when the assertion runs.
      await page.waitForFunction(async () => {
        const content = document.querySelector('page-two ion-content') as HTMLIonContentElement | null;
        if (!content) return false;
        const scrollEl = await content.getScrollElement();
        const first = scrollEl.scrollTop;
        await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
        return scrollEl.scrollTop === first;
      });

      const pageTwoScrollTop = await page.evaluate(async () => {
        const content = document.querySelector('page-two ion-content') as HTMLIonContentElement | null;
        if (!content) return -1;
        const scrollEl = await content.getScrollElement();
        return scrollEl.scrollTop;
      });
      expect(pageTwoScrollTop).toBeLessThan(100);
      expect(page.url()).not.toContain('#anchor');
    });
  });

  test.describe(title('router: tabs'), () => {
    test('should activate the initial tab', async ({ page }) => {
      await page.goto(`/src/components/router/test/basic`, config);

      const tabOne = page.locator('tab-one');

      await expect(tabOne).toBeVisible();

      expect(page.url()).toContain('/basic?');
    });

    /**
     * Selects the Schedule (tab two) tab and verifies that both the
     * page is visible and the URL is correct.
     */
    test('selecting a tab routes to the tab page', async ({ page }) => {
      await page.goto(`/src/components/router/test/basic`, config);

      const tabOne = page.locator('tab-one');
      const tabTwo = page.locator('tab-two');

      await page.click('#tab-button-tab-two');

      await expect(tabOne).toBeHidden();
      await expect(tabTwo).toBeVisible();

      expect(page.url()).toContain('#/two');
    });

    test('should navigate to a nested page within a tab', async ({ page }) => {
      await page.goto('/src/components/router/test/basic#/two', config);

      const tabTwo = page.locator('tab-two');
      const pageOne = page.locator('page-one');

      await expect(tabTwo).toBeVisible();
      await expect(pageOne).toBeVisible();

      await page.click('text=Go to page 2');

      const pageTwo = page.locator('page-two');

      await expect(pageTwo).toBeVisible();
      await expect(pageOne).toBeHidden();

      await expect(page.url()).toContain('#/two/second-page');
    });

    test('navigating directly to a sub page should activate the page', async ({ page }) => {
      await page.goto('/src/components/router/test/basic#/two/second-page', config);

      const tabTwo = page.locator('tab-two');
      const pageTwo = page.locator('page-two');

      await expect(tabTwo).toBeVisible();
      await expect(pageTwo).toBeVisible();
    });
  });
});
