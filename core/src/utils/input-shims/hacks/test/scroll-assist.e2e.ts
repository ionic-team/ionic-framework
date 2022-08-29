import { expect } from '@playwright/test';
import type { Locator } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('scroll-assist', () => {
  const getScrollPosition = async (contentEl: Locator) => {
    return await contentEl.evaluate(async (el: HTMLIonContentElement) => {
      const scrollEl = await el.getScrollElement();

      return scrollEl.scrollTop;
    });
  }
  test.beforeEach(async ({ page, skip }) => {
    skip.rtl();
    skip.mode('md', 'Scroll utils are only needed on iOS mode');
    skip.browser('firefox');
    skip.browser('chromium')

    await page.goto('/src/utils/input-shims/hacks/test');
  })
  test('should not activate when input is above the keyboard', async ({ page }) => {
    const input = page.locator('#input-above-keyboard');
    const content = page.locator('ion-content');

    await expect(await getScrollPosition(content)).toBe(0);

    await input.click();
    await expect(input.locator('input')).toBeFocused();
    await page.waitForChanges();

    await expect(await getScrollPosition(content)).toBe(0);
  });

  test('should activate when input is below the keyboard', async ({ page }) => {
    const input = page.locator('#input-below-keyboard');
    const content = page.locator('ion-content');

    await expect(await getScrollPosition(content)).toBe(0);

    await input.click({ force: true });
    await page.waitForChanges();
    await expect(input.locator('input:not(.cloned-input)')).toBeFocused();

    await expect(await getScrollPosition(content)).not.toBe(0);
  });

  test('should activate even when not explicitly tapping input', async ({ page }) => {
    const label = page.locator('#item-below-keyboard ion-label');
    const input = page.locator('#input-below-keyboard');
    const content = page.locator('ion-content');

    await expect(await getScrollPosition(content)).toBe(0);

    await label.click({ force: true });
    await page.waitForChanges();
    await expect(input.locator('input:not(.cloned-input)')).toBeFocused();

    await expect(await getScrollPosition(content)).not.toBe(0);
  });

  test('should add scroll padding for an input at the bottom of the scroll container', async ({ page }) => {
    const input = page.locator('#input-outside-viewport');
    const content = page.locator('ion-content');

    await expect(await getScrollPosition(content)).toBe(0);
    await expect(content).toHaveCSS('--keyboard-offset', '0px');

    await input.click({ force: true });
    await page.waitForChanges();
    await expect(input.locator('input:not(.cloned-input)')).toBeFocused();

    await expect(await getScrollPosition(content)).not.toBe(0);
    await expect(content).not.toHaveCSS('--keyboard-offset', '0px');
  });

  test('should keep scroll padding even when switching between inputs', async ({ page }) => {
    const input = page.locator('#input-outside-viewport');
    const textarea = page.locator('#textarea-outside-viewport');
    const content = page.locator('ion-content');

    await input.click({ force: true });
    await page.waitForChanges();
    await expect(input.locator('input:not(.cloned-input)')).toBeFocused();

    await expect(content).not.toHaveCSS('--keyboard-offset', '0px');

    await textarea.click({ force: true });
    await page.waitForChanges();
    await expect(textarea.locator('textarea:not(.cloned-input)')).toBeFocused();

    await expect(content).not.toHaveCSS('--keyboard-offset', '0px');
  });
});
