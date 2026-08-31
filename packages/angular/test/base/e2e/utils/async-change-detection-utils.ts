import { expect } from '@playwright/test';
import type { Page } from '@playwright/test';

/**
 * Under Zone.js a field mutated after an `await` has to reach the DOM on its
 * own, which only happens if the Ionic views above the page let a tick through.
 * That branch is the #31406 regression test.
 *
 * The zoneless branch only documents zoneless behavior. It passes either way,
 * since marking a view for check walks OnPush ancestors by design.
 */
export const expectAsyncUpdateToRender = async (page: Page) => {
  const changeDetection = await page.locator('#change-detection').textContent();
  const status = page.locator('#status');

  // Every app uses zone change detection exactly when Zone.js is loaded, so a
  // mismatch means the app lost `provideZoneChangeDetection()` and stopped covering #31406.
  const zoneLoaded = await page.evaluate(() => typeof (window as any).Zone !== 'undefined');
  expect(changeDetection).toBe(zoneLoaded ? 'zone' : 'zoneless');

  await expect(status).toHaveText('idle');

  await page.locator('#run').click();

  if (changeDetection === 'zone') {
    await expect(status).toHaveText('settled');
  } else {
    // Twice the 500ms the page waits before settling, so a working tick would
    // already have landed.
    await page.waitForTimeout(1000);
    await expect(status).toHaveText('pending');

    await page.locator('#mark-for-check').click();
    await expect(status).toHaveText('settled');
  }
};
