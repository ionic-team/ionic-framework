import { test, expect, type Page } from '@playwright/test';

/**
 * Issue #26394: a modifier click (ctrl/meta/shift/alt) or a non-`_self` target on
 * a `routerLink` over a non-anchor Ionic component (ion-item, ion-button) must let
 * the browser handle the navigation natively (new tab, window, download) instead
 * of navigating the current page in-app.
 *
 * Playwright headless can't dispatch a real modifier-click or observe the
 * browser's native new-tab default, so we dispatch a synthetic click on the
 * host (not the shadow anchor, which would fire its own default navigation) and
 * assert the JS handler chain leaves the page unchanged with `preventDefault`
 * uncalled.
 */
test.describe('RouterLink: modifier click', () => {
  const dispatchClick = (page: Page, selector: string, modifiers: Record<string, boolean>) =>
    page.evaluate(
      ({ selector, mods }: { selector: string; mods: Record<string, boolean> }) => {
        const item = document.querySelector(selector) as HTMLElement;
        const ev = new MouseEvent('click', { bubbles: true, composed: true, cancelable: true, button: 0, ...mods });
        item.dispatchEvent(ev);
        return { defaultPrevented: ev.defaultPrevented };
      },
      { selector, mods: modifiers }
    );

  test.beforeEach(async ({ page }) => {
    await page.goto('/standalone/router-link');
  });

  test('normal click navigates the current page in-app', async ({ page }) => {
    const { defaultPrevented } = await dispatchClick(page, '#modifier-item', {});

    await expect(page).toHaveURL(/.*\/standalone\/popover/);
    // The delegate prevents the default to stop a hard page reload.
    expect(defaultPrevented).toBe(true);
  });

  for (const modifier of ['ctrlKey', 'metaKey', 'shiftKey', 'altKey']) {
    test(`${modifier}+click does not navigate the current page and allows native handling`, async ({
      page,
    }, testInfo) => {
      testInfo.annotations.push({
        type: 'issue',
        description: 'https://github.com/ionic-team/ionic-framework/issues/26394',
      });

      const { defaultPrevented } = await dispatchClick(page, '#modifier-item', { [modifier]: true });

      // Give any in-app navigation a chance to run before asserting it did not.
      await page.waitForTimeout(300);
      await expect(page).toHaveURL(/.*\/standalone\/router-link/);
      // Default is left intact so the browser can handle the link natively
      // (new tab, new window, or download, depending on the browser and OS).
      expect(defaultPrevented).toBe(false);
    });
  }

  test('click on a non-_self target does not navigate the current page and allows a native new tab', async ({
    page,
  }, testInfo) => {
    testInfo.annotations.push({
      type: 'issue',
      description: 'https://github.com/ionic-team/ionic-framework/issues/26394',
    });

    const { defaultPrevented } = await dispatchClick(page, '#target-item', {});

    // Give any in-app navigation a chance to run before asserting it did not.
    await page.waitForTimeout(300);
    await expect(page).toHaveURL(/.*\/standalone\/router-link/);
    // Default is left intact so the browser can open the link in a new tab.
    expect(defaultPrevented).toBe(false);
  });
});
