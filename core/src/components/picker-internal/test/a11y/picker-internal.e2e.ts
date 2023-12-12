import AxeBuilder from '@axe-core/playwright';
import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs({ directions: ['ltr'], themes: ['light', 'dark'] }).forEach(({ title, config }) => {
  test.describe(title('picker-internal: a11y'), () => {
    test('should not have accessibility violations', async ({ page }) => {
      await page.setContent(
        `
          <ion-picker-internal>
            <ion-picker-column-internal value="3"></ion-picker-column-internal>
          </ion-picker-internal>
          <script>
            const column = document.querySelector('ion-picker-column-internal');
            column.items = [
              { text: 'First', value: '1' },
              { text: 'Second', value: '2' },
              { text: 'Third', value: '3' },
              { text: 'Fourth', value: '4' },
              { text: 'Fifth', value: '5' },
              { text: 'Sixth', value: '6' },
              { text: 'Seventh', value: '7' },
            ];
          </script>
        `,
        config
      );

      const results = await new AxeBuilder({ page }).analyze();

      expect(results.violations).toEqual([]);
    });
  });
});
