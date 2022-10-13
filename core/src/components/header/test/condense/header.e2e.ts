import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('header: condense', () => {
  test('should be hidden from screen readers when collapsed', async ({ page, skip }) => {
    skip.mode('md');
    skip.rtl();

    await page.goto('/src/components/header/test/condense');
    const largeTitleHeader = page.locator('#largeTitleHeader');
    const smallTitleHeader = page.locator('#smallTitleHeader');
    const content = page.locator('ion-content');

    await expect(smallTitleHeader).toHaveAttribute('aria-hidden', 'true');

    expect(await largeTitleHeader.screenshot()).toMatchSnapshot(
      `header-condense-large-title-initial-diff-${page.getSnapshotSettings()}.png`
    );

    await content.evaluate((el: HTMLIonContentElement) => el.scrollToBottom());
    await page.waitForTimeout(500);

    expect(await smallTitleHeader.screenshot()).toMatchSnapshot(
      `header-condense-large-title-collapsed-diff-${page.getSnapshotSettings()}.png`
    );

    /**
     * Playwright can't do .not.toHaveAttribute() because a value is expected,
     * and toHaveAttribute can't accept a value of type null.
     */
    const ariaHidden = await smallTitleHeader.getAttribute('aria-hidden');
    expect(ariaHidden).toBeNull();

    await content.evaluate((el: HTMLIonContentElement) => el.scrollToTop());
    await page.waitForChanges();

    await expect(smallTitleHeader).toHaveAttribute('aria-hidden', 'true');
  });
});
