import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('datetime-button: basic visual tests', () => {
  test('should not have any visual regressions on load', async ({ page }) => {
    await page.goto('/src/components/datetime-button/test/basic');

    await page.setIonViewport();

    expect(await page.screenshot({ animations: 'disabled', fullPage: true })).toMatchSnapshot(
      `datetime-button-diff-${page.getSnapshotSettings()}.png`
    );
  });

  test('should not have any visual regressions when the date is presented', async ({ page }) => {
    await page.goto('/src/components/datetime-button/test/basic');

    const ionPopoverDidPresent = await page.spyOnEvent('ionPopoverDidPresent');

    await page.setIonViewport();

    const dateButton = await page.locator('ion-datetime-button#default-button #date-button');
    await dateButton.click();

    await ionPopoverDidPresent.next();

    expect(await page.screenshot({ animations: 'disabled', fullPage: true })).toMatchSnapshot(
      `date-presented-diff-${page.getSnapshotSettings()}.png`
    );
  });

  test('should not have any visual regressions when the time is presented', async ({ page }) => {
    await page.goto('/src/components/datetime-button/test/basic');

    const ionPopoverDidPresent = await page.spyOnEvent('ionPopoverDidPresent');

    await page.setIonViewport();

    const timeButton = await page.locator('ion-datetime-button#default-button > #time-button');
    await timeButton.click();

    await ionPopoverDidPresent.next();

    expect(await page.screenshot({ animations: 'disabled', fullPage: true })).toMatchSnapshot(
      `time-presented-diff-${page.getSnapshotSettings()}.png`
    );
  });
});
