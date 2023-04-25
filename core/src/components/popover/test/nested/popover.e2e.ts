import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('popover: nested', async () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/src/components/popover/test/nested');
  });

  test('should render correctly', async ({ page }) => {
    const ionPopoverDidPresent = await page.spyOnEvent('ionPopoverDidPresent');

    await page.click('#first-trigger');
    await ionPopoverDidPresent.next();

    const parentPopover = page.locator('.parent-popover');
    await expect(parentPopover).not.toHaveClass(/overlay-hidden/);

    // note: alignment="start" is needed on popovers so all buttons are on-screen in iOS mode
    // otherwise this one goes off the top of the screen and tests hang/fail
    await page.click('#open-with-popover');
    await ionPopoverDidPresent.next();

    const nestedPopover = page.locator('.child-popover-one');
    await expect(nestedPopover).not.toHaveClass(/overlay-hidden/);

    await page.setIonViewport();
    await expect(page).toHaveScreenshot(`popover-nested-${page.getSnapshotSettings()}.png`);
  });

  test('should dismiss when clicking backdrop', async ({ page }) => {
    const ionPopoverDidPresent = await page.spyOnEvent('ionPopoverDidPresent');
    const ionPopoverDidDismiss = await page.spyOnEvent('ionPopoverDidDismiss');

    await page.click('#first-trigger');
    await ionPopoverDidPresent.next();
    await page.click('#open-with-popover');
    await ionPopoverDidPresent.next();

    const backdrop = page.locator('.parent-popover ion-backdrop');
    await backdrop.click({ position: { x: 5, y: 5 } });
    await ionPopoverDidDismiss.next();

    const nestedPopover = page.locator('.child-popover-one');
    await expect(nestedPopover).toHaveClass(/overlay-hidden/);
  });

  test('should render multiple levels of nesting correctly', async ({ page }) => {
    const ionPopoverDidPresent = await page.spyOnEvent('ionPopoverDidPresent');

    await page.click('#first-trigger');
    await ionPopoverDidPresent.next();

    await page.click('#share-popover');
    await ionPopoverDidPresent.next();

    await page.click('#share-other-popover');
    await ionPopoverDidPresent.next();

    const nestedPopover = page.locator('.child-popover-three');
    await expect(nestedPopover).not.toHaveClass(/overlay-hidden/);

    await page.setIonViewport();
    await expect(page).toHaveScreenshot(`popover-nested-multiple-${page.getSnapshotSettings()}.png`);
  });

  test('clicking backdrop should dismiss multiple levels of popover', async ({ page }) => {
    const ionPopoverDidPresent = await page.spyOnEvent('ionPopoverDidPresent');
    const ionPopoverDidDismiss = await page.spyOnEvent('ionPopoverDidDismiss');

    await page.click('#first-trigger');
    await ionPopoverDidPresent.next();

    await page.click('#share-popover');
    await ionPopoverDidPresent.next();

    await page.click('#share-other-popover');
    await ionPopoverDidPresent.next();

    const backdrop = page.locator('.parent-popover ion-backdrop');
    await backdrop.click({ position: { x: 5, y: 5 } });
    await ionPopoverDidDismiss.next();

    const nestedPopoverOne = page.locator('.child-popover-one');
    await expect(nestedPopoverOne).toHaveClass(/overlay-hidden/);

    const nestedPopoverTwo = page.locator('.child-popover-three');
    await expect(nestedPopoverTwo).toHaveClass(/overlay-hidden/);
  });

  test('should dismiss sibling nested popover when another sibling popover is opened', async ({ page }) => {
    const ionPopoverDidPresent = await page.spyOnEvent('ionPopoverDidPresent');
    const ionPopoverDidDismiss = await page.spyOnEvent('ionPopoverDidDismiss');

    await page.click('#first-trigger');
    await ionPopoverDidPresent.next();

    await page.click('#open-with-popover');
    await ionPopoverDidPresent.next();

    await page.click('#share-popover');
    await ionPopoverDidPresent.next();
    await ionPopoverDidDismiss.next();

    const openWithPopover = page.locator('.child-popover-one');
    const sharePopover = page.locator('.child-popover-two');
    await expect(openWithPopover).toHaveClass(/overlay-hidden/);
    await expect(sharePopover).not.toHaveClass(/overlay-hidden/);
  });
});
