import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('segment: async', () => {
  test('should set checked state when value is set asynchronously', async ({ page, skip }) => {
    skip.rtl();
    skip.mode('md');

    await page.setContent(`
      <ion-segment value="first">
        <ion-segment-button>First</ion-segment-button>
      </ion-segment>
    `);

    const segmentButton = page.locator('ion-segment-button');

    await segmentButton.evaluate((el: HTMLIonSegmentButtonElement) => el.value = 'first');
    await page.waitForChanges();

    await expect(segmentButton).toHaveClass(/segment-button-checked/);
  });
});
