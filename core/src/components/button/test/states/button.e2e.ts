import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

const STATES = ['activated', 'focused'];

// `solid` is the default fill, so it renders without a `fill` attribute
const FILLS = ['solid', 'outline', 'clear'];

configs({ directions: ['ltr'], modes: ['ionic-md', 'md', 'ios'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('button: states'), () => {
    STATES.forEach((state) => {
      test(`should render ${state} buttons`, async ({ page }) => {
        const buttons = FILLS.map((fill) => {
          const fillAttr = fill === 'solid' ? '' : ` fill="${fill}"`;

          return `
            <ion-button${fillAttr} class="ion-${state}">Button</ion-button>
            <ion-button color="warning"${fillAttr} class="ion-${state}">Button</ion-button>
          `;
        }).join('');

        await page.setContent(
          `
          <style>
            .states-container {
              display: grid;
              grid-template-columns: repeat(2, auto);
              justify-content: start;
              gap: 10px;
              padding: 6px;
            }
          </style>

          <div class="states-container">${buttons}</div>
        `,
          config
        );

        const container = page.locator('.states-container');

        await expect(container).toHaveScreenshot(screenshot(`button-${state}`));
      });
    });
  });
});
