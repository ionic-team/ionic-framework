import { test, expect } from '@playwright/test';
import { ionPageVisible, withTestingMode } from './utils/test-utils';

test.describe('Relative Links (deep route)', () => {
  const itemPath = '/relative-links-deep/group/item/5';

  test('should resolve a relative link to an absolute app path', async ({ page }) => {
    await page.goto(withTestingMode(itemPath));
    await ionPageVisible(page, 'relative-links-deep-item');

    await expect(page.locator('[data-testid="resolved-path"]')).toHaveText(`${itemPath}/sibling`);
    await expect(page.locator('[data-testid="relative-link"]')).toHaveAttribute('href', `${itemPath}/sibling`);
  });

  test('should navigate to the sibling page when the relative link is tapped', async ({ page }) => {
    await page.goto(withTestingMode(itemPath));
    await ionPageVisible(page, 'relative-links-deep-item');

    await page.locator('[data-testid="relative-link"]').click();

    await ionPageVisible(page, 'relative-links-deep-sibling');
    await expect(page.locator('[data-testid="sibling-content"]')).toContainText('Reached the sibling page');
    await expect(page).toHaveURL(new RegExp(`${itemPath}/sibling(\\?|$)`));
  });

  test('should resolve a relative link inside a splat route against the splat base', async ({ page }) => {
    await page.goto(withTestingMode('/relative-links-deep/files/docs/readme'));
    await ionPageVisible(page, 'relative-links-deep-files');

    // Plain React Router 7 would include the splat's tail here.
    await expect(page.locator('[data-testid="files-resolved-path"]')).toHaveText('/relative-links-deep/files/edit');
  });
});
