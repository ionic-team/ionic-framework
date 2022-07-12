import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('datetime-button: disabled buttons', () => {
  // eslint-disable-next-line no-empty-pattern
  test.beforeEach(async ({}, testInfo) => {
    test.skip(testInfo.project.metadata.rtl === 'rtl', 'No layout tests');
    test.skip(testInfo.project.metadata.mode === 'ios', 'No mode-specific logic');
  });
  test('buttons should not be enabled when component is disabled', async ({ page }) => {
    await page.setContent(`
      <ion-datetime-button datetime="datetime" disabled="true"></ion-datetime-button>
      <ion-datetime id="datetime" presentation="date-time"></ion-datetime>
    `);
    await page.waitForSelector('.datetime-ready');

    await expect(page.locator('#date-button')).toBeDisabled();
    await expect(page.locator('#time-button')).toBeDisabled();
  });
});
