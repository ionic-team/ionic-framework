import AxeBuilder from '@axe-core/playwright';
import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs({ directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe.only(title('picker-internal: a11y  (light mode)'), () => {
    test('should not have accessibility violations', async ({ page }) => {
      /**
       * `ion-picker-internal` relies on the `ion-content` component for
       * its colors. This is why we need to wrap the picker in the content.
       */
      await page.setContent(
        `
          <ion-content>
            <ion-picker-internal>
              <ion-picker-column-internal value="3"></ion-picker-column-internal>
            </ion-picker-internal>
          </ion-content>
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

configs({ directions: ['ltr'], themes: ['dark'] }).forEach(({ title, config }) => {
  test.describe(title('picker-internal: a11y  (dark mode)'), () => {
    test('should not have accessibility violations', async ({ page }) => {
      /**
       * `ion-picker-internal` relies on the `ion-content` component for
       * its colors. This is why we need to wrap the picker in the content.
       */
      await page.setContent(
        `
          <ion-content>
            <ion-picker-internal>
              <ion-picker-column-internal value="3"></ion-picker-column-internal>
            </ion-picker-internal>
          </ion-content>
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
