import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('range: basic', () => {
  test.beforeEach(async ({ skip, page }) => {
    skip.rtl();

    await page.goto('/src/components/range/test/basic');
  });
  test('should render default range', async ({ page }) => {
    const range = page.locator('ion-range.default');
    expect(await range.screenshot()).toMatchSnapshot(`range-default-${page.getSnapshotSettings()}.png`);
  });
  test('should render dual knob range', async ({ page }) => {
    const range = page.locator('ion-range.dual-knobs');
    expect(await range.screenshot()).toMatchSnapshot(`range-dual-knobs-${page.getSnapshotSettings()}.png`);
  });
  test('should render range with ticks', async ({ page }) => {
    const range = page.locator('ion-range.ticks');
    expect(await range.screenshot()).toMatchSnapshot(`range-ticks-${page.getSnapshotSettings()}.png`);
  });
  test('should render pin', async ({ page }) => {
    const range = page.locator('ion-range.pin');
    const knob = range.locator('.range-knob-handle');

    // Force the pin to show
    await knob.evaluate((el: HTMLElement) => el.classList.add('ion-focused'));

    expect(await range.screenshot({ animations: 'disabled' })).toMatchSnapshot(
      `range-pin-${page.getSnapshotSettings()}.png`
    );
  });
});
