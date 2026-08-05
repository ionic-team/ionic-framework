import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs().forEach(({ title, screenshot, config }) => {
  test.describe(title('select: slot'), () => {
    test('should not have visual regressions with a start-positioned label', async ({ page }) => {
      await page.setContent(
        `
          <ion-select label-placement="start" placeholder="Select weight" label="Weight">
            <ion-icon slot="start" name="barbell" aria-hidden="true"></ion-icon>
            <ion-icon slot="start" name="heart" aria-hidden="true"></ion-icon>
            <ion-select-option value="100">100</ion-select-option>
            <ion-select-option value="200">200</ion-select-option>
            <ion-select-option value="300">300</ion-select-option>
            <ion-button slot="end" aria-label="Show/hide password">
              <ion-icon slot="icon-only" name="lock-closed" aria-hidden="true"></ion-icon>
            </ion-button>
            <ion-button slot="end">
              <ion-icon slot="icon-only" name="trash" aria-hidden="true"></ion-icon>
            </ion-button>
          </ion-select>
        `,
        config
      );

      const select = page.locator('ion-select');
      await expect(select).toHaveScreenshot(screenshot(`select-slot-label-start`));
    });

    test('should not have visual regressions with a start-positioned label when value is present', async ({ page }) => {
      await page.setContent(
        `
          <ion-select label-placement="start" placeholder="Select weight" value="100" label="Weight">
            <ion-icon slot="start" name="barbell" aria-hidden="true"></ion-icon>
            <ion-icon slot="start" name="heart" aria-hidden="true"></ion-icon>
            <ion-select-option value="100">100</ion-select-option>
            <ion-select-option value="200">200</ion-select-option>
            <ion-select-option value="300">300</ion-select-option>
            <ion-button slot="end" aria-label="Show/hide password">
              <ion-icon slot="icon-only" name="lock-closed" aria-hidden="true"></ion-icon>
            </ion-button>
            <ion-button slot="end">
              <ion-icon slot="icon-only" name="trash" aria-hidden="true"></ion-icon>
            </ion-button>
          </ion-select>
        `,
        config
      );

      const select = page.locator('ion-select');
      await expect(select).toHaveScreenshot(screenshot(`select-slot-label-start-value`));
    });

    test('should not have visual regressions with a floating label', async ({ page }) => {
      await page.setContent(
        `
          <ion-select label-placement="floating" placeholder="Select weight" label="Weight">
            <ion-icon slot="start" name="barbell" aria-hidden="true"></ion-icon>
            <ion-icon slot="start" name="heart" aria-hidden="true"></ion-icon>
            <ion-select-option value="100">100</ion-select-option>
            <ion-select-option value="200">200</ion-select-option>
            <ion-select-option value="300">300</ion-select-option>
            <ion-button slot="end" aria-label="Show/hide password">
              <ion-icon slot="icon-only" name="lock-closed" aria-hidden="true"></ion-icon>
            </ion-button>
            <ion-button slot="end">
              <ion-icon slot="icon-only" name="trash" aria-hidden="true"></ion-icon>
            </ion-button>
          </ion-select>
        `,
        config
      );

      const select = page.locator('ion-select');
      await expect(select).toHaveScreenshot(screenshot(`select-slot-label-floating`));
    });

    /**
     * The placeholder is not displayed for floating labels unless
     * the select is expanded. This captures the expanded state
     * where the placeholder is visible.
     */
    test('should not have visual regressions with a floating label when expanded', async ({ page }) => {
      test.info().annotations.push({
        type: 'issue',
        description: 'https://github.com/ionic-team/ionic-framework/issues/30402',
      });

      await page.setContent(
        `
          <ion-select label-placement="floating" placeholder="Select weight" label="Weight" class="select-expanded label-floating">
            <ion-icon slot="start" name="barbell" aria-hidden="true"></ion-icon>
            <ion-icon slot="start" name="heart" aria-hidden="true"></ion-icon>
            <ion-select-option value="100">100</ion-select-option>
            <ion-select-option value="200">200</ion-select-option>
            <ion-select-option value="300">300</ion-select-option>
            <ion-button slot="end" aria-label="Show/hide password">
              <ion-icon slot="icon-only" name="lock-closed" aria-hidden="true"></ion-icon>
            </ion-button>
            <ion-button slot="end">
              <ion-icon slot="icon-only" name="trash" aria-hidden="true"></ion-icon>
            </ion-button>
          </ion-select>
        `,
        config
      );

      const select = page.locator('ion-select');
      await expect(select).toHaveScreenshot(screenshot(`select-slot-label-floating-expanded`));
    });

    test('should not have visual regressions with a floating label when value is present', async ({ page }) => {
      await page.setContent(
        `
          <ion-select label-placement="floating" placeholder="Select weight" value="100" label="Weight">
            <ion-icon slot="start" name="barbell" aria-hidden="true"></ion-icon>
            <ion-icon slot="start" name="heart" aria-hidden="true"></ion-icon>
            <ion-select-option value="100">100</ion-select-option>
            <ion-select-option value="200">200</ion-select-option>
            <ion-select-option value="300">300</ion-select-option>
            <ion-button slot="end" aria-label="Show/hide password">
              <ion-icon slot="icon-only" name="lock-closed" aria-hidden="true"></ion-icon>
            </ion-button>
            <ion-button slot="end">
              <ion-icon slot="icon-only" name="trash" aria-hidden="true"></ion-icon>
            </ion-button>
          </ion-select>
        `,
        config
      );

      const select = page.locator('ion-select');
      await expect(select).toHaveScreenshot(screenshot(`select-slot-label-floating`));
    });
  });
});

/**
 * The solid and outline fills are only supported by `md` mode.
 */
configs({ modes: ['md'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('select: slot'), () => {
    ['solid', 'outline'].forEach((fill) => {
      test.describe(`fill: ${fill}`, () => {
        test('should not have visual regressions with a start-positioned label', async ({ page }) => {
          await page.setContent(
            `
              <!-- Apply container styles to capture the entire select -->
              <style>
                .container {
                  padding: 8px;
                }
              </style>

              <div class="container">
                <ion-select label-placement="start" fill="${fill}" placeholder="Select weight" label="Weight">
                  <ion-icon slot="start" name="barbell" aria-hidden="true"></ion-icon>
                  <ion-icon slot="start" name="heart" aria-hidden="true"></ion-icon>
                  <ion-select-option value="100">100</ion-select-option>
                  <ion-select-option value="200">200</ion-select-option>
                  <ion-select-option value="300">300</ion-select-option>
                  <ion-button slot="end" aria-label="Show/hide password">
                    <ion-icon slot="icon-only" name="lock-closed" aria-hidden="true"></ion-icon>
                  </ion-button>
                  <ion-button slot="end">
                    <ion-icon slot="icon-only" name="trash" aria-hidden="true"></ion-icon>
                  </ion-button>
                </ion-select>
              </div>
            `,
            config
          );

          const container = page.locator('.container');
          await expect(container).toHaveScreenshot(screenshot(`select-slot-fill-${fill}-label-start`));
        });

        test('should not have visual regressions with a start-positioned label when value is present', async ({
          page,
        }) => {
          await page.setContent(
            `
              <!-- Apply container styles to capture the entire select -->
              <style>
                .container {
                  padding: 8px;
                }
              </style>

              <div class="container">
                <ion-select label-placement="start" fill="${fill}" placeholder="Select weight" value="100" label="Weight">
                  <ion-icon slot="start" name="barbell" aria-hidden="true"></ion-icon>
                  <ion-icon slot="start" name="heart" aria-hidden="true"></ion-icon>
                  <ion-select-option value="100">100</ion-select-option>
                  <ion-select-option value="200">200</ion-select-option>
                  <ion-select-option value="300">300</ion-select-option>
                  <ion-button slot="end" aria-label="Show/hide password">
                    <ion-icon slot="icon-only" name="lock-closed" aria-hidden="true"></ion-icon>
                  </ion-button>
                  <ion-button slot="end">
                    <ion-icon slot="icon-only" name="trash" aria-hidden="true"></ion-icon>
                  </ion-button>
                </ion-select>
              </div>
            `,
            config
          );

          const container = page.locator('.container');
          await expect(container).toHaveScreenshot(screenshot(`select-slot-fill-${fill}-label-start-value`));
        });

        test('should not have visual regressions with a floating label', async ({ page }) => {
          await page.setContent(
            `
              <!-- Apply container styles to capture the entire select -->
              <style>
                .container {
                  padding: 8px;
                }
              </style>

              <div class="container">
                <ion-select label-placement="floating" fill="${fill}" placeholder="Select weight" label="Weight">
                  <ion-icon slot="start" name="barbell" aria-hidden="true"></ion-icon>
                  <ion-icon slot="start" name="heart" aria-hidden="true"></ion-icon>
                  <ion-select-option value="100">100</ion-select-option>
                  <ion-select-option value="200">200</ion-select-option>
                  <ion-select-option value="300">300</ion-select-option>
                  <ion-button slot="end" aria-label="Show/hide password">
                    <ion-icon slot="icon-only" name="lock-closed" aria-hidden="true"></ion-icon>
                  </ion-button>
                  <ion-button slot="end">
                    <ion-icon slot="icon-only" name="trash" aria-hidden="true"></ion-icon>
                  </ion-button>
                </ion-select>
              </div>
            `,
            config
          );

          const container = page.locator('.container');
          await expect(container).toHaveScreenshot(screenshot(`select-slot-fill-${fill}-label-floating`));
        });

        /**
         * The placeholder is not displayed for floating labels unless
         * the select is expanded. This captures the expanded state
         * where the placeholder is visible.
         */
        test('should not have visual regressions with a floating label when expanded', async ({ page }) => {
          test.info().annotations.push({
            type: 'issue',
            description: 'https://github.com/ionic-team/ionic-framework/issues/30402',
          });

          await page.setContent(
            `
              <!-- Apply container styles to capture the entire select -->
              <style>
                .container {
                  padding: 8px;
                }
              </style>

              <div class="container">
                <ion-select label-placement="floating" fill="${fill}" placeholder="Select weight" label="Weight" class="select-expanded label-floating">
                  <ion-icon slot="start" name="barbell" aria-hidden="true"></ion-icon>
                  <ion-icon slot="start" name="heart" aria-hidden="true"></ion-icon>
                  <ion-select-option value="100">100</ion-select-option>
                  <ion-select-option value="200">200</ion-select-option>
                  <ion-select-option value="300">300</ion-select-option>
                  <ion-button slot="end" aria-label="Show/hide password">
                    <ion-icon slot="icon-only" name="lock-closed" aria-hidden="true"></ion-icon>
                  </ion-button>
                  <ion-button slot="end">
                    <ion-icon slot="icon-only" name="trash" aria-hidden="true"></ion-icon>
                  </ion-button>
                </ion-select>
              </div>
            `,
            config
          );

          const container = page.locator('.container');
          await expect(container).toHaveScreenshot(screenshot(`select-slot-fill-${fill}-label-floating-expanded`));
        });

        test('should not have visual regressions with a floating label when value is present', async ({ page }) => {
          await page.setContent(
            `
              <!-- Apply container styles to capture the entire select -->
              <style>
                .container {
                  padding: 8px;
                }
              </style>

              <div class="container">
                <ion-select label-placement="floating" fill="${fill}" placeholder="Select weight" value="100" label="Weight">
                  <ion-icon slot="start" name="barbell" aria-hidden="true"></ion-icon>
                  <ion-icon slot="start" name="heart" aria-hidden="true"></ion-icon>
                  <ion-select-option value="100">100</ion-select-option>
                  <ion-select-option value="200">200</ion-select-option>
                  <ion-select-option value="300">300</ion-select-option>
                  <ion-button slot="end" aria-label="Show/hide password">
                    <ion-icon slot="icon-only" name="lock-closed" aria-hidden="true"></ion-icon>
                  </ion-button>
                  <ion-button slot="end">
                    <ion-icon slot="icon-only" name="trash" aria-hidden="true"></ion-icon>
                  </ion-button>
                </ion-select>
              </div>
            `,
            config
          );

          const container = page.locator('.container');
          await expect(container).toHaveScreenshot(screenshot(`select-slot-fill-${fill}-label-floating-value`));
        });
      });
    });
  });
});
