import AxeBuilder from '@axe-core/playwright';
import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs({ directions: ['ltr'], themeModes: ['dark', 'light'] }).forEach(({ config, title }) => {
  test.describe(title('select-popover: a11y'), () => {
    test('should not have accessibility violations when header is defined', async ({ page }) => {
      await page.setContent(
        `
          <ion-popover is-open="true">
            <ion-select-popover multiple="false"></ion-select-popover>
          </ion-popover>

          <script>
            const selectPopover = document.querySelector('ion-select-popover');
            selectPopover.options = [
              { value: 'apple', text: 'Apple', disabled: false, checked: true },
              { value: 'banana', text: 'Banana', disabled: false, checked: false },
            ];
          </script>
        `,
        config
      );

      const ionPopoverDidPresent = await page.spyOnEvent('ionPopoverDidPresent');
      const popover = page.locator('ion-popover');

      await popover.evaluate((el: HTMLIonPopoverElement) => el.present());
      await ionPopoverDidPresent.next();

      // TODO(FW-5698): remove withRules() call and resolve Axe errors
      const results = await new AxeBuilder({ page }).withRules('color-contrast').analyze();
      expect(results.violations).toEqual([]);
    });
  });
});
