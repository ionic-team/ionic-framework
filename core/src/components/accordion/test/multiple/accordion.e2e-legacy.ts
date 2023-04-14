import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('accordion: multiple', () => {
  test('should update value and visually expand items', async ({ page, skip }) => {
    skip.rtl();

    await page.goto(`/src/components/accordion/test/multiple`);
    const accordionGroup = page.locator('ion-accordion-group');
    const diningHeader = page.locator('ion-accordion[value="dining"] ion-item[slot="header"]');
    const attractionsHeader = page.locator('ion-accordion[value="attractions"] ion-item[slot="header"]');

    await expect(accordionGroup).toHaveJSProperty('value', 'attractions');

    await expect(accordionGroup).toHaveScreenshot(`accordion-one-open-${page.getSnapshotSettings()}.png`);

    await diningHeader.click();
    await page.waitForChanges();

    await expect(accordionGroup).toHaveJSProperty('value', ['attractions', 'dining']);

    await expect(accordionGroup).toHaveScreenshot(`accordion-two-open-${page.getSnapshotSettings()}.png`);

    await diningHeader.click();
    await attractionsHeader.click();
    await page.waitForChanges();

    await expect(accordionGroup).toHaveJSProperty('value', []);

    await expect(accordionGroup).toHaveScreenshot(`accordion-zero-open-${page.getSnapshotSettings()}.png`);
  });
});
