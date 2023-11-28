import AxeBuilder from '@axe-core/playwright';
import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

const ionicColors: {
  [key: string]: {
    hex: string;
    lightBackground: string;
    darkBackground: string;
  };
} = {
  primary: {
    hex: '#428cff',
    lightBackground: '#fff',
    darkBackground: '#121212',
  },
  secondary: {
    hex: '#50c8ff',
    lightBackground: '#fff',
    darkBackground: '#121212',
  },
  tertiary: {
    hex: '#6a64ff',
    lightBackground: '#fff',
    darkBackground: '#121212',
  },
};

configs({ modes: ['md'], directions: ['ltr'] }).forEach(({ config, title }) => {
  test.describe(title('theme: dark'), () => {
    test.beforeAll(async ({ skip }) => {
      skip.browser('firefox');
      skip.browser('webkit');
    });

    test.describe('on a light background', () => {
      for (const color of Object.keys(ionicColors)) {
        test(`color "${color}" should pass AA guidelines`, async ({ page }) => {
          await page.setContent(
            `
          <style>
            :root {
              --ion-color-${color}: ${ionicColors[color].hex};
            }
            body {
              background-color: ${ionicColors[color].lightBackground};
            }
          </style>
          <p style="color: var(--ion-color-${color});">Hello World</p>
        `,
            config
          );

          const results = await new AxeBuilder({ page }).analyze();
          expect(results.violations).toEqual([]);
        });
      }
    });

    test.describe('on a dark background', () => {
      for (const color of Object.keys(ionicColors)) {
        test(`color "${color}" should pass AA guidelines`, async ({ page }) => {
          await page.setContent(
            `
          <style>
            :root {
              --ion-color-${color}: ${ionicColors[color].hex};
            }
            body {
              background-color: ${ionicColors[color].darkBackground};
            }
          </style>
          <p style="color: var(--ion-color-${color});">Hello World</p>
        `,
            config
          );

          const results = await new AxeBuilder({ page }).analyze();
          expect(results.violations).toEqual([]);
        });
      }
    });
  });
});
