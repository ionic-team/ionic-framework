import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('popover: adjustment', async () => {
  test('should not render the popover offscreen', async ({ page }) => {
    await page.goto('/src/components/popover/test/adjustment');

    /**
     * We need to click in an area where
     * there is not enough room to show the popover
     * below the click coordinates but not enough
     * room above the click coordinates that we
     * can just move the popover to without it going
     * offscreen.
     */
    await page.setViewportSize({
      width: 500,
      height: 400,
    });

    const ionPopoverDidPresent = await page.spyOnEvent('ionPopoverDidPresent');

    await page.mouse.click(300, 300);

    await ionPopoverDidPresent.next();

    const popoverContent = page.locator('ion-popover .popover-content');
    const box = (await popoverContent.boundingBox())!;

    expect(box.y > 0).toBe(true);
  });
});
