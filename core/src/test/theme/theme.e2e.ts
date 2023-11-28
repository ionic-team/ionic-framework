import AxeBuilder from '@axe-core/playwright';
import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

/**
 * Ionic `light` color should not be tested against a white background (light mode).
 */
// configs({ modes: ['md', 'ios'], directions: ['ltr'], themes: ['light'] }).forEach(({ config, title }) => {
//   test.describe(title('theme'), () => {
//     const colors = ['primary', 'secondary', 'tertiary', 'success', 'warning', 'danger', 'medium', 'dark'];

//     for (const color of colors) {
//       test(`color "${color}" should pass AA guidelines`, async ({ page, skip }) => {
//         skip.browser('firefox');
//         skip.browser('webkit');

//         await page.setContent(
//           `
//           <style>
//             body {
//               background-color: var(--ion-background-color);
//             }
//           </style>
//           <p style="color: var(--ion-color-${color});">Hello World</p>
//         `,
//           config
//         );

//         const results = await new AxeBuilder({ page }).analyze();
//         expect(results.violations).toEqual([]);
//       });
//     }
//   });
// });

configs({ modes: ['md', 'ios'], directions: ['ltr'], themes: ['dark'] }).forEach(({ config, title }) => {
  test.describe(title('theme'), () => {
    const colors = ['primary', 'secondary', 'tertiary', 'success', 'warning', 'danger', 'light', 'medium', 'dark'];

    for (const color of colors) {
      test(`color "${color}" should pass AA guidelines`, async ({ page, skip }) => {
        skip.browser('firefox');
        skip.browser('webkit');

        await page.setContent(
          `
        <style>
          body {
            background-color: var(--ion-background-color);
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
