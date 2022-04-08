import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('datetime-button: sizing in overlays with default datetime', () => {
  test('should be correctly sized when opening date picker in popover', async ({ page }) => {
    await page.goto('/src/components/datetime-button/test/overlays');
    const ionPopoverDidPresent = await page.spyOnEvent('ionPopoverDidPresent');

    const dateButton = await page.locator('#popover-default-button #date-button');
    await dateButton.click();

    await ionPopoverDidPresent.next();

    await page.setIonViewport();

    expect(await page.screenshot({ animations: 'disabled', fullPage: true })).toMatchSnapshot(
      `datetime-button-date-popover-sizing-${page.getSnapshotSettings()}.png`
    );
  });

  test('should be correctly sized when opening time picker in popover', async ({ page }) => {
    await page.goto('/src/components/datetime-button/test/overlays');
    const ionPopoverDidPresent = await page.spyOnEvent('ionPopoverDidPresent');

    const dateButton = await page.locator('#popover-default-button #time-button');
    await dateButton.click();

    await ionPopoverDidPresent.next();

    await page.setIonViewport();

    expect(await page.screenshot({ animations: 'disabled', fullPage: true })).toMatchSnapshot(
      `datetime-button-time-popover-sizing-${page.getSnapshotSettings()}.png`
    );
  });

  test('should be correctly sized when opening date picker in modal', async ({ page }) => {
    await page.goto('/src/components/datetime-button/test/overlays');
    const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');

    const dateButton = await page.locator('#modal-default-button #date-button');
    await dateButton.click();

    await ionModalDidPresent.next();

    await page.setIonViewport();

    expect(await page.screenshot({ animations: 'disabled', fullPage: true })).toMatchSnapshot(
      `datetime-button-date-modal-sizing-${page.getSnapshotSettings()}.png`
    );
  });

  test('should be correctly sized when opening time picker in modal', async ({ page }) => {
    await page.goto('/src/components/datetime-button/test/overlays');
    const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');

    const timeButton = await page.locator('#modal-default-button #date-button');
    await timeButton.click();

    await ionModalDidPresent.next();

    await page.setIonViewport();

    expect(await page.screenshot({ animations: 'disabled', fullPage: true })).toMatchSnapshot(
      `datetime-button-time-modal-sizing-${page.getSnapshotSettings()}.png`
    );
  });
});

test.describe('datetime-button: sizing in overlays with custom datetime', () => {
  test('should be correctly sized when opening date picker in popover', async ({ page }) => {
    await page.goto('/src/components/datetime-button/test/overlays');
    const ionPopoverDidPresent = await page.spyOnEvent('ionPopoverDidPresent');

    const dateButton = await page.locator('#popover-custom-button #date-button');
    await dateButton.click();

    await ionPopoverDidPresent.next();

    await page.setIonViewport();

    expect(await page.screenshot({ animations: 'disabled', fullPage: true })).toMatchSnapshot(
      `custom-datetime-button-date-popover-sizing-${page.getSnapshotSettings()}.png`
    );
  });

  test('should be correctly sized when opening time picker in popover', async ({ page }) => {
    await page.goto('/src/components/datetime-button/test/overlays');
    const ionPopoverDidPresent = await page.spyOnEvent('ionPopoverDidPresent');

    const dateButton = await page.locator('#popover-custom-button #time-button');
    await dateButton.click();

    await ionPopoverDidPresent.next();

    await page.setIonViewport();

    expect(await page.screenshot({ animations: 'disabled', fullPage: true })).toMatchSnapshot(
      `custom-datetime-button-time-popover-sizing-${page.getSnapshotSettings()}.png`
    );
  });

  test('should be correctly sized when opening date picker in modal', async ({ page }) => {
    await page.goto('/src/components/datetime-button/test/overlays');
    const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');

    const dateButton = await page.locator('#modal-custom-button #date-button');
    await dateButton.click();

    await ionModalDidPresent.next();

    await page.setIonViewport();

    expect(await page.screenshot({ animations: 'disabled', fullPage: true })).toMatchSnapshot(
      `custom-datetime-button-date-modal-sizing-${page.getSnapshotSettings()}.png`
    );
  });

  test('should be correctly sized when opening time picker in modal', async ({ page }) => {
    await page.goto('/src/components/datetime-button/test/overlays');
    const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');

    const timeButton = await page.locator('#modal-custom-button #date-button');
    await timeButton.click();

    await ionModalDidPresent.next();

    await page.setIonViewport();

    expect(await page.screenshot({ animations: 'disabled', fullPage: true })).toMatchSnapshot(
      `custom-datetime-button-time-modal-sizing-${page.getSnapshotSettings()}.png`
    );
  });
});
