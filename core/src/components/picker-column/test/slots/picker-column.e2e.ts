import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs({ directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('picker-column: slots'), () => {
    test('should not have visual regressions with prefix and suffix', async ({ page }) => {
      await page.setContent(
        `
        <ion-picker>
          <ion-picker-column value="b">
            <div slot="prefix">Prefix</div>
            <div slot="suffix">Suffix</div>
          </ion-picker-column>
        </ion-picker>

        <script>
          const column = document.querySelector('ion-picker-column');
          column.items = [
            { text: 'A', value: 'a' },
            { text: 'B', value: 'b' },
            { text: 'C', value: 'c' }
          ]
        </script>
      `,
        config
      );

      const picker = page.locator('ion-picker');
      await expect(picker).toHaveScreenshot(screenshot(`picker-prefix-suffix`));
    });
  });
});