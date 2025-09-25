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
      font-size: 14pt;
    }

    .ion-color {
      color: var(--ion-color-foreground);
    }

    .ion-color-background {
      background: var(--ion-color-base);
      color: var(--ion-color-contrast);
    }

    .ion-color-background-shade {
      background: var(--ion-color-shade);
      color: var(--ion-color-contrast);
    }

    .ion-color-background-tint {
      background: var(--ion-color-tint);
      color: var(--ion-color-contrast);
    }

    .ion-color-subtle {
      color: var(--ion-color-subtle-foreground);
    }

    .ion-color-subtle-background {
      background: var(--ion-color-subtle-base);
      color: var(--ion-color-subtle-contrast);
    }

    .ion-color-subtle-background-shade {
      background: var(--ion-color-subtle-shade);
      color: var(--ion-color-subtle-contrast);
    }

    .ion-color-subtle-background-tint {
      background: var(--ion-color-subtle-tint);
      color: var(--ion-color-subtle-contrast);
    }
  </style>
`;

/**
 * All colors should be tested in the following scenarios:
 * 1) The foreground color as the text color against the default background color
 * 2) The contrast color as the text color against the base color as the background color
 * 3) The contrast color as the text color against the shade color as the background color
 * 4) The contrast color as the text color against the tint color as the background color
 * 5) The subtle foreground color as the text color against the default background color
 * 6) The subtle contrast color as the text color against the subtle base color as the background color
 * 7) The subtle contrast color as the text color against the subtle shade color as the background color
 * 8) The subtle contrast color as the text color against the subtle tint color as the background color
 */
configs({ modes: ['ionic-md'], directions: ['ltr'], palettes: ['light', 'dark'] }).forEach(({ config, title }) => {
  const colors = ['primary', 'secondary', 'tertiary', 'success', 'warning', 'danger', 'light', 'medium', 'dark'];

  // TODO: Re-enable this test once the colors have been finalized
  test.describe.skip(title('palette colors: bold'), () => {
    test.beforeEach(({ skip }) => {
      skip.browser('firefox', 'Color contrast ratio is consistent across browsers');
      skip.browser('webkit', 'Color contrast ratio is consistent across browsers');
    });

    for (const color of colors) {
      // 1) The foreground color as the text color against the default background color
      test(`foreground color "${color}" should pass AA guidelines`, async ({ page }) => {
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

      // 2) The contrast color as the text color against the base color as the background color
      test(`contrast color on "${color}" background should pass AA guidelines`, async ({ page }) => {
        await page.setContent(
          `${styleTestHelpers}
          <main class="ion-color-${color}">
            <p class="ion-color-background">Hello World</p>
          </main>`,
          config
        );

        const results = await new AxeBuilder({ page }).analyze();
        expect(results.violations).toEqual([]);
      });

      // 3) The contrast color as the text color against the shade color as the background color
      test(`contrast color on "${color}" background shade should pass AA guidelines`, async ({ page }) => {
        await page.setContent(
          `${styleTestHelpers}
          <main class="ion-color-${color}">
            <p class="ion-color-background-shade">Hello World</p>
          </main>`,
          config
        );

        const results = await new AxeBuilder({ page }).analyze();
        expect(results.violations).toEqual([]);
      });

      // 4) The contrast color as the text color against the tint color as the background color
      // TODO(ROU-10778): Re-enable this test once the colors have been finalized
      // Fails on primary, tertiary, success, danger
      test.skip(`contrast color on "${color}" background tint should pass AA guidelines`, async ({ page }) => {
        await page.setContent(
          `${styleTestHelpers}
          <main class="ion-color-${color}">
            <p class="ion-color-background-tint">Hello World</p>
          </main>`,
          config
        );

        const results = await new AxeBuilder({ page }).analyze();
        expect(results.violations).toEqual([]);
      });
    }
  });

  // TODO: Re-enable this test once the colors have been finalized
  test.describe.skip(title('palette colors: subtle'), () => {
    test.beforeEach(({ skip }) => {
      skip.browser('firefox', 'Color contrast ratio is consistent across browsers');
      skip.browser('webkit', 'Color contrast ratio is consistent across browsers');
    });

    for (const color of colors) {
      // 5) The subtle foreground color as the text color against the default background color
      test(`subtle foreground color "${color}" should pass AA guidelines`, async ({ page }) => {
        await page.setContent(
          `${styleTestHelpers}
          <main class="ion-color-${color}">
            <p class="ion-color-subtle">Hello World</p>
          </main>`,
          config
        );

        const results = await new AxeBuilder({ page }).analyze();
        expect(results.violations).toEqual([]);
      });

      // 6) The subtle contrast color as the text color against the subtle base color as the background color
      test(`subtle contrast color on "${color}" subtle background should pass AA guidelines`, async ({ page }) => {
        await page.setContent(
          `${styleTestHelpers}
          <main class="ion-color-${color}">
            <p class="ion-color-subtle-background">Hello World</p>
          </main>`,
          config
        );

        const results = await new AxeBuilder({ page }).analyze();
        expect(results.violations).toEqual([]);
      });

      // 7) The subtle contrast color as the text color against the subtle shade color as the background color
      // TODO(ROU-10778): Re-enable this test once the colors have been finalized
      test.skip(`subtle contrast color on "${color}" subtle background shade should pass AA guidelines`, async ({
        page,
      }) => {
        await page.setContent(
          `${styleTestHelpers}
          <main class="ion-color-${color}">
            <p class="ion-color-subtle-background-shade">Hello World</p>
          </main>`,
          config
        );

        const results = await new AxeBuilder({ page }).analyze();
        expect(results.violations).toEqual([]);
      });

      // 8) The subtle contrast color as the text color against the subtle tint color as the background color
      test(`subtle contrast color on "${color}" subtle background tint should pass AA guidelines`, async ({ page }) => {
        await page.setContent(
          `${styleTestHelpers}
          <main class="ion-color-${color}">
            <p class="ion-color-subtle-background-tint">Hello World</p>
          </main>`,
          config
        );

        const results = await new AxeBuilder({ page }).analyze();
        expect(results.violations).toEqual([]);
      });
    }
  });
});

configs({ modes: ['ionic-md'], directions: ['ltr'] }).forEach(({ config, title }) => {
  test.describe(title('palette colors: custom'), () => {
    test(`overriding secondary color with foreground variant should style text properly`, async ({ page }) => {
      await page.setContent(
        `${styleTestHelpers}

        <style>
          :root {
            --ion-color-secondary: #ff6c52;
            --ion-color-secondary-rgb: 255,108,82;
            --ion-color-secondary-contrast: #000000;
            --ion-color-secondary-contrast-rgb: 0,0,0;
            --ion-color-secondary-shade: #e05f48;
            --ion-color-secondary-tint: #ff7b63;
            --ion-color-secondary-foreground: #e05f48;
          }
        </style>

        <main class="ion-color-secondary">
          <p class="ion-color">Hello World</p>
        </main>`,
        config
      );

      const paragraph = await page.locator('p');
      const color = await paragraph.evaluate((el) => getComputedStyle(el).color);

      // Ensure the color matches --ion-color-secondary-foreground
      expect(color).toBe('rgb(224, 95, 72)');
    });
  });
});
