import { expect } from '@playwright/test';
import { configs, test, Viewports } from '@utils/test/playwright';

import { openPopover } from '../test.utils';

configs().forEach(({ title, screenshot, config }) => {
  test.describe(title('popover: position'), async () => {
    /**
     * The popovers have showBackdrop=false so we can open all of them at once
     * and massively cut down on screenshots taken. The content has its own
     * backdrop so you can still see the popovers.
     */
    test('should not have visual regressions', async ({ page }) => {
      await page.goto('/src/components/popover/test/position', config);

      // Set viewport large enough for all buttons and popovers to be visible at once.
      await page.setViewportSize({width: 768, height: 1024});

      const sides = ['top', 'right', 'bottom', 'left', 'start', 'end'];
      const alignments = ['start', 'center', 'end'];

      for (const side of sides) {
        for (const alignment of alignments) {
          await openPopover(page, `${side}-${alignment}`, true);
        }
      }

      await openPopover(page, `ltr-start`, true);
      await openPopover(page, `rtl-start`, true);

      await expect(page).toHaveScreenshot(screenshot(`popover-position`));
    });
  });
});

configs({ directions: ['ltr', 'rtl'] }).forEach(({ title, config }) => {
  test.describe(title('popover: position'), async () => {
    test('should be on the left when side is start and an ancestor declares ltr', async({ page }) => {
      await page.goto('/src/components/popover/test/position', config);
      await page.setViewportSize(Viewports.tablet.portrait);
      await openPopover(page, `ltr-start`);

      const button = page.locator('#ltr-start');
      const popoverContent = page.locator('.ltr-start-popover').locator('.popover-content');
      const buttonBox = await button.boundingBox();
      const popoverBox = await popoverContent.boundingBox();

      expect(popoverBox!.x).toBeLessThan(buttonBox!.x);
    })

    test('should be on the right when side is start and an ancestor declares rtl', async({ page }) => {
      await page.goto('/src/components/popover/test/position', config);
      await page.setViewportSize(Viewports.tablet.portrait);
      await openPopover(page, `rtl-start`);

      const button = page.locator('#rtl-start');
      const popoverContent = page.locator('.rtl-start-popover').locator('.popover-content');
      const buttonBox = await button.boundingBox();
      const popoverBox = await popoverContent.boundingBox();

      expect(popoverBox!.x).toBeGreaterThan(buttonBox!.x);
    })
  });
});
