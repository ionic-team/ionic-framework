import AxeBuilder from '@axe-core/playwright';
import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

/**
 * Small text is defined as 14pt (~18.5px)
 * when computing color contrast: https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html
 */
const styleTestHelpers = `
  <style>
    main {
      background: var(--ion-color-contrast);
      font-size: 14pt;
    }
    .ion-background {
      background: var(--ion-color-base);
    }
    .ion-background-shade {
      background: var(--ion-color-shade);
    }
    .ion-background-tint {
      background: var(--ion-color-tint);
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
  </style>
`;

/**
 * All colors should be tested in the following scenarios:
 * 1) The base color as the text color against the contrast color as the background color
 * 2) The contrast color as the text color against the base color as the background color
 * 3) The contrast color as the text color against the shade color as the background color
 * 4) The contrast color as the text color against the tint color as the background color
 * 5) The base color as the text color against the base color at 0.08 opacity as the background color
 * 6) The base color as the text color against the base color at 0.12 opacity as the background color
 * 7) The base color as the text color against the base color at 0.16 opacity as the background color
 */
configs({ modes: ['md'], directions: ['ltr'], themeModes: ['light', 'dark'] }).forEach(({ config, title }) => {
  const colors = ['primary', 'secondary', 'tertiary', 'success', 'warning', 'danger', 'light', 'medium', 'dark'];

  test.describe(title('theme'), () => {
    test.beforeEach(({ skip }) => {
      skip.browser('firefox', 'Color contrast ratio is consistent across browsers');
      skip.browser('webkit', 'Color contrast ratio is consistent across browsers');
    });

    for (const color of colors) {
      test(`color "${color}" should pass AA guidelines`, async ({ page }) => {
        await page.setContent(
          `${styleTestHelpers}
          <main class="ion-color-${color}">
            <p class="ion-color">Hello World</p>
          </main>`,
          config
        );

        const results = await new AxeBuilder({ page }).analyze();
        expect(results.violations).toEqual([]);
      });

      test(`contrast color on "${color}" background should pass AA guidelines`, async ({ page }) => {
        await page.setContent(
          `${styleTestHelpers}
          <main class="ion-color-${color}">
            <p class="ion-color-contrast ion-background">Hello World</p>
          </main>`,
          config
        );

        const results = await new AxeBuilder({ page }).analyze();
        expect(results.violations).toEqual([]);
      });

      test(`contrast color on "${color}" background shade should pass AA guidelines`, async ({ page }) => {
        await page.setContent(
          `${styleTestHelpers}
          <main class="ion-color-${color}">
            <p class="ion-color-contrast ion-background-shade">Hello World</p>
          </main>`,
          config
        );

        const results = await new AxeBuilder({ page }).analyze();
        expect(results.violations).toEqual([]);
      });

      test(`contrast color on "${color}" background tint should pass AA guidelines`, async ({ page }) => {
        await page.setContent(
          `${styleTestHelpers}
          <main class="ion-color-${color}">
            <p class="ion-color-contrast ion-background-tint">Hello World</p>
          </main>`,
          config
        );

        const results = await new AxeBuilder({ page }).analyze();
        expect(results.violations).toEqual([]);
      });

      test(`color "${color}" on 0.08 opacity background should pass AA guidelines`, async ({ page }) => {
        await page.setContent(
          `${styleTestHelpers}
          <main class="ion-color-${color}">
            <p class="ion-color ion-background-opacity-08">Hello World</p>
          </main>`,
          config
        );

        const results = await new AxeBuilder({ page }).analyze();
        expect(results.violations).toEqual([]);
      });

      test(`color "${color}" on 0.12 opacity background should pass AA guidelines`, async ({ page }) => {
        await page.setContent(
          `${styleTestHelpers}
          <main class="ion-color-${color}">
            <p class="ion-color ion-background-opacity-12">Hello World</p>
          </main>`,
          config
        );

        const results = await new AxeBuilder({ page }).analyze();
        expect(results.violations).toEqual([]);
      });

      test(`color "${color}" on 0.16 opacity background should pass AA guidelines`, async ({ page }) => {
        await page.setContent(
          `${styleTestHelpers}
          <main class="ion-color-${color}">
            <p class="ion-color ion-background-opacity-16">Hello World</p>
          </main>`,
          config
        );

        const results = await new AxeBuilder({ page }).analyze();
        expect(results.violations).toEqual([]);
      });
    }
  });
});

configs({ modes: ['md'], directions: ['ltr'], themeModes: ['high-contrast', 'high-contrast-dark'] }).forEach(
  ({ config, title }) => {
    const colors = ['primary', 'secondary', 'tertiary', 'success', 'warning', 'danger', 'light', 'medium', 'dark'];

    test.describe(title('theme'), () => {
      test.beforeEach(({ skip }) => {
        skip.browser('firefox', 'Color contrast ratio is consistent across browsers');
        skip.browser('webkit', 'Color contrast ratio is consistent across browsers');
      });

      for (const color of colors) {
        test(`color "${color}" should pass AAA guidelines`, async ({ page }) => {
          await page.setContent(
            `${styleTestHelpers}
          <main class="ion-color-${color}">
            <p class="ion-color">Hello World</p>
          </main>`,
            config
          );

          const results = await new AxeBuilder({ page })
            .options({ rules: { 'color-contrast-enhanced': { enabled: true } } })
            .analyze();
          expect(results.violations).toEqual([]);
        });

        test(`contrast color on "${color}" background should pass AAA guidelines`, async ({ page }) => {
          await page.setContent(
            `${styleTestHelpers}
          <main class="ion-color-${color}">
            <p class="ion-color-contrast ion-background">Hello World</p>
          </main>`,
            config
          );

          const results = await new AxeBuilder({ page })
            .options({ rules: { 'color-contrast-enhanced': { enabled: true } } })
            .analyze();
          expect(results.violations).toEqual([]);
        });

        test(`contrast color on "${color}" background shade should pass AAA guidelines`, async ({ page }) => {
          await page.setContent(
            `${styleTestHelpers}
          <main class="ion-color-${color}">
            <p class="ion-color-contrast ion-background-shade">Hello World</p>
          </main>`,
            config
          );

          const results = await new AxeBuilder({ page })
            .options({ rules: { 'color-contrast-enhanced': { enabled: true } } })
            .analyze();
          expect(results.violations).toEqual([]);
        });

        test(`contrast color on "${color}" background tint should pass AAA guidelines`, async ({ page }) => {
          await page.setContent(
            `${styleTestHelpers}
          <main class="ion-color-${color}">
            <p class="ion-color-contrast ion-background-tint">Hello World</p>
          </main>`,
            config
          );

          const results = await new AxeBuilder({ page })
            .options({ rules: { 'color-contrast-enhanced': { enabled: true } } })
            .analyze();
          expect(results.violations).toEqual([]);
        });
      }
    });
  }
);
