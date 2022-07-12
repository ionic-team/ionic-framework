import { expect } from '@playwright/test';
import type { E2EPage } from '@utils/test/playwright';
import { test } from '@utils/test/playwright';

test.describe('item: inputs', () => {
  test.skip('should not have visual regressions', async ({ page }) => {
    await page.goto(`/src/components/item/test/inputs`);

    const screenshots = [];

    const disableToggle = page.locator('#btnDisabled');
    const submitBtn = page.locator('#submit');

    // Check form
    await submitBtn.click();
    await checkFormResult(
      page,
      '{"date":"2022-04-01T10:00","select":"n64","toggle":"","input":"","input2":"","checkbox":"","range":"10"}'
    );

    /**
     * We need to expand the viewport so that all the datetime components
     * enter the visible viewport. This allows the I/O to fire and
     * .datetime-ready to be added.
     */
    await page.setIonViewport();
    // Wait for all datetime inputs to be ready
    await page.waitForSelector('#datetime.datetime-ready');
    await page.waitForSelector('#datetime-end.datetime-ready');

    // Default case, enabled and no value
    screenshots.push({
      name: `item-inputs-${page.getSnapshotSettings()}.png`,
      screenshot: await captureScreenshot(page),
    });

    // Disable everything
    await disableToggle.click();
    await page.waitForChanges();

    // check form
    await submitBtn.click();
    await checkFormResult(page, '{}');

    screenshots.push({
      name: `item-should-disable-all-${page.getSnapshotSettings()}.png`,
      screenshot: await captureScreenshot(page),
    });

    // Reenable and set some value
    await disableToggle.click();
    await page.click('#btnSomeValue');

    // check form
    await submitBtn.click();
    await checkFormResult(
      page,
      '{"date":"2022-04-01T10:00","select":"nes","toggle":"on","input":"Some text","input2":"Some text","checkbox":"on","range":"20"}'
    );

    screenshots.push({
      name: `item-should-reenable-and-set-value-${page.getSnapshotSettings()}.png`,
      screenshot: await captureScreenshot(page),
    });

    // Set "null"
    await page.click('#btnNullValue');

    screenshots.push({
      name: `item-should-set-null-${page.getSnapshotSettings()}.png`,
      screenshot: await captureScreenshot(page),
    });

    // Set "empty"
    await page.click('#btnEmptyValue');

    screenshots.push({
      name: `item-should-set-empty-${page.getSnapshotSettings()}.png`,
      screenshot: await captureScreenshot(page),
    });

    // Test multiple
    await page.click('#checkbox-start');
    await page.click('#datetime-end');

    screenshots.push({
      name: `item-should-check-checkbox-and-open-datepicker-${page.getSnapshotSettings()}.png`,
      screenshot: await captureScreenshot(page),
    });

    await page.click('#button-end');
    await page.waitForChanges();

    screenshots.push({
      name: `item-should-change-button-color-to-red-${page.getSnapshotSettings()}.png`,
      screenshot: await page.screenshot(),
    });

    for (const screenshot of screenshots) {
      expect(screenshot.screenshot).toMatchSnapshot(screenshot.name);
    }
  });
});

const checkFormResult = async (page: E2EPage, content: string) => {
  const div = page.locator('#form-result');
  await expect(await div.textContent()).toEqual(content);
};

/**
 * Resizes the viewport and captures a screenshot.
 * Required for this test suite, since the DOM size is not
 * the same at each test case.
 */
const captureScreenshot = async (page: E2EPage) => {
  await page.setIonViewport();
  return page.screenshot();
};
