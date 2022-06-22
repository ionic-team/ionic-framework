import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('accordion: a11y', () => {
  test('accordions should be keyboard navigable', async ({ page }) => {
    await page.goto(`/src/components/accordion/test/a11y`);
    const personalInfoHeader = page.locator('ion-accordion:first-child > ion-item');
    const billingAddressHeader = page.locator('ion-accordion:nth-child(2) > ion-item');
    const shippingAddressHeader = page.locator('ion-accordion:nth-child(3) > ion-item');
    const addressInput = page.locator('#address1 input');

    await page.keyboard.press('Tab');
    expect(personalInfoHeader).toBeFocused();

    await page.keyboard.press('ArrowDown');
    expect(billingAddressHeader).toBeFocused();

    await page.keyboard.press('ArrowDown');
    expect(shippingAddressHeader).toBeFocused();

    await page.keyboard.press('ArrowDown');
    expect(personalInfoHeader).toBeFocused();

    await page.keyboard.press('ArrowUp');
    expect(shippingAddressHeader).toBeFocused();

    // open Shipping Address accordion and move focus to the input inside it
    await page.keyboard.press('Enter');
    await page.waitForChanges();
    await page.keyboard.press('Tab');
    expect(addressInput).toBeFocused();

    // ensure keyboard interaction doesn't move focus from body
    await page.keyboard.press('ArrowDown');
    expect(addressInput).toBeFocused();
  });
});
