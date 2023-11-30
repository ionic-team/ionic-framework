import AxeBuilder from '@axe-core/playwright';
import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs({ modes: ['md', 'ios'], directions: ['ltr'], themes: ['dark'] }).forEach(({ config, title }) => {
  test.describe(title('theme'), () => {
    const colors = ['primary', 'secondary', 'tertiary', 'success', 'warning', 'danger', 'light', 'medium', 'dark'];

    for (const color of colors) {
      test(`color "${color}" should pass AA guidelines`, async ({ page, skip }) => {
        skip.browser('firefox');
        skip.browser('webkit');

        await page.setContent(`<p class="ion-color ion-color-${color}">Hello World</p>`, config);

        const results = await new AxeBuilder({ page }).analyze();
        expect(results.violations).toEqual([]);
      });

      test(`contrast color on "${color}" background should pass AA guidelines`, async ({ page, skip }) => {
        skip.browser('firefox');
        skip.browser('webkit');

        await page.setContent(
          `<p class="ion-color-contrast ion-background ion-color-${color}">Hello World</p>`,
          config
        );

        const results = await new AxeBuilder({ page }).analyze();
        expect(results.violations).toEqual([]);
      });

      test(`color "${color}" on 0.08 opacity background should pass AA guidelines`, async ({ page, skip }) => {
        skip.browser('firefox');
        skip.browser('webkit');

        await page.setContent(
          `<p class="ion-color ion-color-${color} ion-background-opacity-08">Hello World</p>`,
          config
        );

        const results = await new AxeBuilder({ page }).analyze();
        expect(results.violations).toEqual([]);
      });

      test(`color "${color}" on 0.12 opacity background should pass AA guidelines`, async ({ page, skip }) => {
        skip.browser('firefox');
        skip.browser('webkit');

        await page.setContent(
          `<p class="ion-color ion-color-${color} ion-background-opacity-12">Hello World</p>`,
          config
        );

        const results = await new AxeBuilder({ page }).analyze();
        expect(results.violations).toEqual([]);
      });

      test(`color "${color}" on 0.16 opacity background should pass AA guidelines`, async ({ page, skip }) => {
        skip.browser('firefox');
        skip.browser('webkit');

        await page.setContent(
          `<p class="ion-color ion-color-${color} ion-background-opacity-16">Hello World</p>`,
          config
        );

        const results = await new AxeBuilder({ page }).analyze();
        expect(results.violations).toEqual([]);
      });
    }
  });
});
