import { test, expect } from '@playwright/test';

test.describe('Accordion', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/lazy/accordions');
  });

  test('should correctly expand on multiple modal opens', async ({ page }) => {
    await page.locator('#open-modal').click();

    await expect(page.locator('ion-accordion:first-of-type')).toHaveClass(/accordion-expanded/);
    await expect(page.locator('ion-accordion:last-of-type')).not.toHaveClass(/accordion-expanded/);

    await page.locator('#dismiss').click();

    await page.locator('#open-modal').click();

    await expect(page.locator('ion-accordion:first-of-type')).toHaveClass(/accordion-expanded/);
    await expect(page.locator('ion-accordion:last-of-type')).not.toHaveClass(/accordion-expanded/);
  });
});
