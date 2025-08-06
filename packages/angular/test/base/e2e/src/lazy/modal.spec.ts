import { test, expect } from '@playwright/test';

test.describe('Modals', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/lazy/modals');
  });

  test('should open standalone modal and close', async ({ page }) => {
    await page.locator('#action-button').click();

    await expect(page.locator('ion-modal')).toBeVisible();

    await expect(page.locator('app-modal-example h2')).toHaveText('123');
    await expect(page.locator('app-modal-example h3')).toHaveText('321');
    await expect(page.locator('#modalInstance')).toHaveText('true');

    await expect(page.locator('#onWillDismiss')).toHaveText('false');
    await expect(page.locator('#onDidDismiss')).toHaveText('false');

    await page.locator('#close-modal').click();

    await expect(page.locator('ion-modal')).not.toBeVisible();

    await expect(page.locator('#onWillDismiss')).toHaveText('true');
    await expect(page.locator('#onDidDismiss')).toHaveText('true');
  });

  test('should open nav modal and close', async ({ page }) => {
    await page.locator('#action-button-2').click();

    await expect(page.locator('ion-modal')).toBeVisible();

    await expect(page.locator('ion-nav > *:last-child h2')).toHaveText('123');
    await expect(page.locator('ion-nav > *:last-child h3')).toHaveText('321');

    await page.locator('ion-nav > *:last-child .push-page').click();

    await expect(page.locator('ion-nav > *:last-child h2')).toHaveText('pushed!');
    await expect(page.locator('ion-nav > *:last-child h3')).toHaveText('');

    await page.locator('ion-nav > *:last-child .pop-page').click();

    await expect(page.locator('ion-nav > *:last-child h2')).toHaveText('123');
  });
});

test.describe('Modals: Inline', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/lazy/modal-inline');
  });

  test('should initially have no items', async ({ page }) => {
    await expect(page.locator('ion-list ion-item')).not.toBeVisible();
  });

  test('should have items after opening', async ({ page }) => {
    await page.locator('#open-modal').click();

    await expect(page.locator('ion-list ion-item:nth-child(1)')).toHaveText('A');
    await expect(page.locator('ion-list ion-item:nth-child(2)')).toHaveText('B');
    await expect(page.locator('ion-list ion-item:nth-child(3)')).toHaveText('C');
    await expect(page.locator('ion-list ion-item:nth-child(4)')).toHaveText('D');
  });

  test('should have a div with .ion-page after opening', async ({ page }) => {
    await page.locator('#open-modal').click();

    await expect(page.locator('ion-modal').locator('.ion-page')).toBeVisible();
  });

  test('should remove .ion-page when closing the modal', async ({ page }) => {
    await page.locator('#open-modal').click();

    await expect(page.locator('ion-modal').locator('.ion-page')).toBeVisible();
    await page.locator('ion-modal').click({ position: { x: 20, y: 20 } });

    await expect(page.locator('ion-modal').locator('.ion-page')).not.toBeVisible();
  });

  test.describe('Modals: setting the current breakpoint', () => {
    test('should emit ionBreakpointDidChange', async ({ page }) => {
      await page.locator('#open-modal').click();

      // Wait for the modal to be visible
      await expect(page.locator('ion-modal')).toBeVisible();

      // Wait for the modal to be fully presented and ready
      await page.waitForTimeout(500);

      await page.evaluate(() => {
        const modal = document.querySelector('ion-modal') as any;
        modal.setCurrentBreakpoint(1);
      });

      // Wait for the event to fire
      await page.waitForTimeout(100);

      await expect(page.locator('#breakpointDidChange')).toHaveText('1');
    });
  });
});

test.describe('Modals: in a modal', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/lazy/modals');
    await page.locator('#action-button').click();
    await page.locator('#close-modal').click();
    await page.locator('#action-button').click();
  });

  test('should render ion-item item-has-value class when control value is set', async ({ page }) => {
    await page.locator('ion-select').click();
    await expect(page.locator('ion-alert')).toBeVisible();
    // Option 0 option
    await page.locator('ion-alert .alert-radio-button').nth(0).click();
    // Click confirm button
    await page.locator('ion-alert .alert-button:not(.alert-button-role-cancel)').click();

    await expect(page.locator('#inputWithFloatingLabel')).toHaveClass(/item-has-value/);
  });

  test('should not render ion-item item-has-value class when control value is undefined', async ({ page }) => {
    await page.locator('#set-to-undefined').click();
    await expect(page.locator('#inputWithFloatingLabel')).not.toHaveClass(/item-has-value/);
  });

  test('should not render ion-item item-has-value class when control value is null', async ({ page }) => {
    await page.locator('#set-to-null').click();
    await expect(page.locator('#inputWithFloatingLabel')).not.toHaveClass(/item-has-value/);
  });
});
