import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('accordion: multiple', () => {
  test('should update value and not have visual regressions', async ({ page }) => {
    await page.goto(`/src/components/accordion/test/multiple`);
    const accordionGroup = page.locator('ion-accordion-group');
    const diningHeader = page.locator('ion-accordion[value="dining"] ion-item[slot="header"]');
    const attractionsHeader = page.locator('ion-accordion[value="attractions"] ion-item[slot="header"]');

    // toHaveValue doesn't work with non-input elements
    expect(accordionGroup).toHaveAttribute('value', 'attractions');

    expect(await accordionGroup.screenshot()).toMatchSnapshot(`accordion-one-open-${page.getSnapshotSettings()}.png`);

    await diningHeader.click();
    await page.waitForChanges();

    // toHaveValue and toHaveAttribute expect string values, but we need to check for an array
    const value = await accordionGroup.evaluate((el: HTMLIonAccordionGroupElement) => el.value);
    expect(value).toEqual(['attractions', 'dining']);

    expect(await accordionGroup.screenshot()).toMatchSnapshot(`accordion-two-open-${page.getSnapshotSettings()}.png`);

    await diningHeader.click();
    await attractionsHeader.click();
    await page.waitForChanges();

    const value2 = await accordionGroup.evaluate((el: HTMLIonAccordionGroupElement) => el.value);
    expect(value2).toEqual([]);

    expect(await accordionGroup.screenshot()).toMatchSnapshot(`accordion-zero-open-${page.getSnapshotSettings()}.png`);
  });
});
