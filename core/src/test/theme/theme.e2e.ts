import AxeBuilder from '@axe-core/playwright';
import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

const styleTestHelpers = `
  <style>
    .ion-background {
      background: var(--ion-color-base);
    }
    .ion-background-opacity-08 {
      background: rgba(var(--ion-color-base-rgb), 0.08);
    }
    .ion-background-opacity-12 {
      background: rgba(var(--ion-color-base-rgb), 0.12);
    }
    .ion-background-opacity-16 {
      background: rgba(var(--ion-color-base-rgb), 0.16);
    }
    .ion-color {
      color: var(--ion-color-base);
    }
    .ion-color-contrast {
      color: var(--ion-color-contrast);
    }
    .ion-color-shade {
      color: var(--ion-color-shade);
    }
    .ion-color-tint {
      color: var(--ion-color-tint);
    }
  </style>
`;

const colors = ['primary', 'secondary', 'tertiary', 'success', 'warning', 'danger', 'light', 'medium', 'dark'];

configs({ modes: ['md', 'ios'], directions: ['ltr'], themes: ['dark'] }).forEach(({ config, title }) => {
  test.describe(title('theme'), () => {
    test.beforeEach(({ skip }) => {
      skip.browser('firefox', 'Color contrast ratio is consistent across browsers');
      skip.browser('webkit', 'Color contrast ratio is consistent across browsers');
    });

    for (const color of colors) {
      test(`color "${color}" should pass AA guidelines`, async ({ page }) => {
        await page.setContent(
          `${styleTestHelpers}
          <main>
            <p class="ion-color ion-color-${color}">Hello World</p>
          </main>`,
          config
        );

        const results = await new AxeBuilder({ page }).analyze();
        expect(results.violations).toEqual([]);
      });

      test(`contrast color on "${color}" background should pass AA guidelines`, async ({ page }) => {
        await page.setContent(
          `${styleTestHelpers}
          <main>
            <p class="ion-color-contrast ion-background ion-color-${color}">Hello World</p>
          </main>`,
          config
        );

        const results = await new AxeBuilder({ page }).analyze();
        expect(results.violations).toEqual([]);
      });

      test(`color "${color}" on 0.08 opacity background should pass AA guidelines`, async ({ page }) => {
        await page.setContent(
          `${styleTestHelpers}
          <main>
            <p class="ion-color ion-color-${color} ion-background-opacity-08">Hello World</p>
          </main>`,
          config
        );

        const results = await new AxeBuilder({ page }).analyze();
        expect(results.violations).toEqual([]);
      });

      test(`color "${color}" on 0.12 opacity background should pass AA guidelines`, async ({ page }) => {
        await page.setContent(
          `${styleTestHelpers}
          <main>
            <p class="ion-color ion-color-${color} ion-background-opacity-12">Hello World</p>
          </main>`,
          config
        );

        const results = await new AxeBuilder({ page }).analyze();
        expect(results.violations).toEqual([]);
      });

      test(`color "${color}" on 0.16 opacity background should pass AA guidelines`, async ({ page }) => {
        await page.setContent(
          `${styleTestHelpers}
          <main>
            <p class="ion-color ion-color-${color} ion-background-opacity-16">Hello World</p>
          </main>`,
          config
        );

        const results = await new AxeBuilder({ page }).analyze();
        expect(results.violations).toEqual([]);
      });
    }
  });
});
