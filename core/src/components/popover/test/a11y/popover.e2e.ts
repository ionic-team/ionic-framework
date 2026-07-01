import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs({ modes: ['md'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('popover: a11y'), () => {
    test('should have role="dialog" and aria-modal by default', async ({ page }) => {
      /**
       * `aria-modal` is only meaningful on an element with role `dialog`
       * or `alertdialog`; without a role, assistive technologies ignore
       * it. Popover previously set `aria-modal="true"` with no role at
       * all, so it was silently non-functional for screen readers.
       */
      await page.goto(`/src/components/popover/test/a11y`, config);

      const ionPopoverDidPresent = await page.spyOnEvent('ionPopoverDidPresent');
      const popover = page.locator('#basic-popover');

      await page.locator('#open-popover').click();
      await ionPopoverDidPresent.next();

      await expect(popover).toHaveAttribute('role', 'dialog');
      await expect(popover).toHaveAttribute('aria-modal', 'true');
    });

    test('should allow htmlAttributes to override the default role', async ({ page }) => {
      await page.goto(`/src/components/popover/test/a11y`, config);

      const ionPopoverDidPresent = await page.spyOnEvent('ionPopoverDidPresent');
      const popover = page.locator('#menu-popover');

      await page.locator('#open-menu-popover').click();
      await ionPopoverDidPresent.next();

      await expect(popover).toHaveAttribute('role', 'menu');
    });
  });
});
