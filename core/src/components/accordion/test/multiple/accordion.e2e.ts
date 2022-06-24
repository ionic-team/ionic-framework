import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('accordion: multiple', () => {
  test('should update value and not have visual regressions', async ({ page }) => {
    await page.goto(`/src/components/accordion/test/multiple`);
    const accordionGroup = page.locator('ion-accordion-group');
    const diningHeader = page.locator('ion-accordion[value="dining"] ion-item[slot="header"]');
    const attractionsHeader = page.locator('ion-accordion[value="attractions"] ion-item[slot="header"]');

    await expect(accordionGroup).toHaveJSProperty('value', 'attractions');

    expect(await accordionGroup.screenshot()).toMatchSnapshot(`accordion-one-open-${page.getSnapshotSettings()}.png`);

    await diningHeader.click();
    await page.waitForChanges();

    await expect(accordionGroup).toHaveJSProperty('value', ['attractions', 'dining']);

    expect(await accordionGroup.screenshot()).toMatchSnapshot(`accordion-two-open-${page.getSnapshotSettings()}.png`);

    await diningHeader.click();
    await attractionsHeader.click();
    await page.waitForChanges();

    await expect(accordionGroup).toHaveJSProperty('value', []);

    expect(await accordionGroup.screenshot()).toMatchSnapshot(`accordion-zero-open-${page.getSnapshotSettings()}.png`);
  });
});
