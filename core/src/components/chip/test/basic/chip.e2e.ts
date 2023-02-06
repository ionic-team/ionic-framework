import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('chip: rendering', () => {
  test('should not have visual regressions', async ({ page }) => {
    await page.goto('/src/components/chip/test/basic');

    await page.setIonViewport();

    expect(await page.screenshot()).toMatchSnapshot(`chip-basic-${page.getSnapshotSettings()}.png`);
  });

  test('should not clip descenders in item', async ({ page, skip }) => {
    skip.rtl();
    skip.mode('md');

    test.info().annotations.push({
      type: 'issue',
      description: 'https://github.com/ionic-team/ionic-framework/issues/18313',
    });

    await page.setContent(`
      <ion-list>
        <ion-item>
          <ion-chip>
            <ion-label>Agreements</ion-label>
          </ion-chip>
        </ion-item>
      </ion-list>
    `);

    const chip = page.locator('ion-chip');

    expect(await chip.screenshot()).toMatchSnapshot(`chip-descender-${page.getSnapshotSettings()}.png`);
  });
});
