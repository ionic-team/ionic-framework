

import { expect } from '@playwright/test';
import type { E2EPage } from '@utils/test/playwright';
import { test } from '@utils/test/playwright';

test.describe('item: inputs', () => {
  test('should not have visual regressions', async ({ page }) => {
    await page.goto(`/src/components/item/test/inputs`);

    await page.setIonViewport();

    // Check form
    await page.click('#submit');
    await checkFormResult(
      page,
      '{"date":"","select":"n64","toggle":"","input":"","input2":"","checkbox":"","range":"10"}'
    );
    await page.waitForTimeout(100);

    // Default case, enabled and no value
    expect(await page.screenshot()).toMatchSnapshot(`item-inputs-${page.getSnapshotSettings()}.png`);

    // Disable everything
    const disableToggle = page.locator('#btnDisabled');
    await disableToggle.click();
    await page.waitForTimeout(300);

    // check form
    await page.click('#submit');
    await page.waitForTimeout(100);
    await checkFormResult(page, '{}');
    await page.waitForTimeout(100);

    expect(await page.screenshot()).toMatchSnapshot(`item-should-disable-all-${page.getSnapshotSettings()}.png`);

    // Reenable and set some value
    await disableToggle.click();
    await page.click('#btnSomeValue');
    await page.waitForTimeout(100);

    // check form
    await page.click('#submit');
    await checkFormResult(
      page,
      '{"date":"2016-12-09","select":"nes","toggle":"on","input":"Some text","input2":"Some text","checkbox":"on","range":"20"}'
    );
    await page.waitForTimeout(100);

    expect(await page.screenshot()).toMatchSnapshot(`item-should-reenable-and-set-value-${page.getSnapshotSettings()}.png`);

    // Set "null"
    await page.click('#btnNullValue');
    await page.waitForTimeout(100);

    expect(await page.screenshot()).toMatchSnapshot(`item-set-null-${page.getSnapshotSettings()}.png`);

    // Set "empty"
    await page.click('#btnEmptyValue');
    await page.waitForTimeout(100);

    expect(await page.screenshot()).toMatchSnapshot(`item-should-set-empty-${page.getSnapshotSettings()}.png`);

    // Test multiple
    await page.click('#checkbox-start');
    await page.click('#datetime-end');
    await page.waitForTimeout(300);

    expect(await page.screenshot()).toMatchSnapshot(`item-should-check-checkbox-and-open-datepicker-${page.getSnapshotSettings()}.png`);

    await page.click('#button-end');
    await page.waitForTimeout(100);

    expect(await page.screenshot()).toMatchSnapshot(`item-should-change-button-color-to-red-${page.getSnapshotSettings()}.png`);
  });
});

const checkFormResult = async (page: E2EPage, content: string) => {
  const div = page.locator('#form-result');
  expect(await div.textContent()).toEqual(content);
};
