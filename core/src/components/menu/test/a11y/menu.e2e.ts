import AxeBuilder from '@axe-core/playwright';
import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('picker-internal: a11y', () => {
  test('should not have accessibility violations', async ({ page }) => {
    await page.goto(`/src/components/menu/test/a11y`);
    const ionDidOpen = await page.spyOnEvent('ionDidOpen');

    const menu = await page.locator('ion-menu');
    await menu.evaluate((el: HTMLIonMenuElement) => el.open());
    await ionDidOpen.next();

    const results = await new AxeBuilder({ page }).analyze();

    expect(results.violations).toEqual([]);
  });
});
