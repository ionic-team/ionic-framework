import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('header: condense', () => {
  test('should be hidden from screen readers when collapsed', async ({ page, skip }) => {
    skip.mode('md');
    skip.rtl();

    await page.goto('/src/components/header/test/condense');
    const header = page.locator('#collapsibleHeader');
    const content = page.locator('ion-content');

    await expect(header).toHaveAttribute('aria-hidden', 'true');

    await content.evaluate((el: HTMLIonContentElement) => el.scrollToBottom());
    await page.waitForChanges();

    /**
     * Playwright can't do .not.toHaveAttribute() because a value is expected,
     * and toHaveAttribute can't accept a value of type null.
     */
    const ariaHidden = await header.getAttribute('aria-hidden');
    expect(ariaHidden).toBeNull();

    await content.evaluate((el: HTMLIonContentElement) => el.scrollToTop());
    await page.waitForChanges();

    await expect(header).toHaveAttribute('aria-hidden', 'true');
  });
});
