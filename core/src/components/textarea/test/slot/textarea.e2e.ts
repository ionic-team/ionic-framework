import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs().forEach(({ title, screenshot, config }) => {
  test.describe(title('textarea: slot'), () => {
    test('should not have visual regressions with a start-positioned label', async ({ page }) => {
      await page.setContent(
        `
          <ion-textarea label-placement="start" label="Weight">
            <ion-icon slot="start" name="barbell" aria-hidden="true"></ion-icon>
            <ion-icon slot="start" name="heart" aria-hidden="true"></ion-icon>
            <ion-button slot="end" aria-label="Show/hide password">
              <ion-icon slot="icon-only" name="lock-closed" aria-hidden="true"></ion-icon>
            </ion-button>
            <ion-button slot="end">
              <ion-icon slot="icon-only" name="trash" aria-hidden="true"></ion-icon>
            </ion-button>
          </ion-textarea>
        `,
        config
      );

      const textarea = page.locator('ion-textarea');
      await expect(textarea).toHaveScreenshot(screenshot(`textarea-slot-label-start`));
    });

    test('should not have visual regressions with a start-positioned label when value is present', async ({ page }) => {
      await page.setContent(
        `
          <ion-textarea label-placement="start" value="100" label="Weight">
            <ion-icon slot="start" name="barbell" aria-hidden="true"></ion-icon>
            <ion-icon slot="start" name="heart" aria-hidden="true"></ion-icon>
            <ion-button slot="end" aria-label="Show/hide password">
              <ion-icon slot="icon-only" name="lock-closed" aria-hidden="true"></ion-icon>
            </ion-button>
            <ion-button slot="end">
              <ion-icon slot="icon-only" name="trash" aria-hidden="true"></ion-icon>
            </ion-button>
          </ion-textarea>
        `,
        config
      );

      const textarea = page.locator('ion-textarea');
      await expect(textarea).toHaveScreenshot(screenshot(`textarea-slot-label-start-value`));
    });

    test('should not have visual regressions with a floating label', async ({ page }) => {
      await page.setContent(
        `
          <ion-textarea label-placement="floating" label="Weight">
            <ion-icon slot="start" name="barbell" aria-hidden="true"></ion-icon>
            <ion-icon slot="start" name="heart" aria-hidden="true"></ion-icon>
            <ion-button slot="end" aria-label="Show/hide password">
              <ion-icon slot="icon-only" name="lock-closed" aria-hidden="true"></ion-icon>
            </ion-button>
            <ion-button slot="end">
              <ion-icon slot="icon-only" name="trash" aria-hidden="true"></ion-icon>
            </ion-button>
          </ion-textarea>
        `,
        config
      );

      const textarea = page.locator('ion-textarea');
      await expect(textarea).toHaveScreenshot(screenshot(`textarea-slot-label-floating`));
    });

    test('should not have visual regressions with a floating label when value is present', async ({ page }) => {
      await page.setContent(
        `
          <ion-textarea label-placement="floating" value="100" label="Weight">
            <ion-icon slot="start" name="barbell" aria-hidden="true"></ion-icon>
            <ion-icon slot="start" name="heart" aria-hidden="true"></ion-icon>
            <ion-button slot="end" aria-label="Show/hide password">
              <ion-icon slot="icon-only" name="lock-closed" aria-hidden="true"></ion-icon>
            </ion-button>
            <ion-button slot="end">
              <ion-icon slot="icon-only" name="trash" aria-hidden="true"></ion-icon>
            </ion-button>
          </ion-textarea>
        `,
        config
      );

      const textarea = page.locator('ion-textarea');
      await expect(textarea).toHaveScreenshot(screenshot(`textarea-slot-label-floating-value`));
    });
  });
});

/**
 * The solid and outline fills are only supported by `md` mode.
 */
configs({ modes: ['md'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('textarea: slot'), () => {
    ['solid', 'outline'].forEach((fill) => {
      test.describe(`fill: ${fill}`, () => {
        test('should not have visual regressions with a start-positioned label', async ({ page }) => {
          await page.setContent(
            `
              <!-- Apply container styles to capture the entire textarea -->
              <style>
                .container {
                  padding: 8px;
                }
              </style>

              <div class="container">
                <ion-textarea label-placement="start" fill="${fill}" label="Weight">
                  <ion-icon slot="start" name="barbell" aria-hidden="true"></ion-icon>
                  <ion-icon slot="start" name="heart" aria-hidden="true"></ion-icon>
                  <ion-button slot="end" aria-label="Show/hide password">
                    <ion-icon slot="icon-only" name="lock-closed" aria-hidden="true"></ion-icon>
                  </ion-button>
                  <ion-button slot="end">
                    <ion-icon slot="icon-only" name="trash" aria-hidden="true"></ion-icon>
                  </ion-button>
                </ion-textarea>
              </div>
            `,
            config
          );

          const container = page.locator('.container');
          await expect(container).toHaveScreenshot(screenshot(`textarea-slot-fill-${fill}-label-start`));
        });

        test('should not have visual regressions with a start-positioned label when value is present', async ({
          page,
        }) => {
          await page.setContent(
            `
              <!-- Apply container styles to capture the entire textarea -->
              <style>
                .container {
                  padding: 8px;
                }
              </style>

              <div class="container">
                <ion-textarea label-placement="start" fill="${fill}" value="100" label="Weight">
                  <ion-icon slot="start" name="barbell" aria-hidden="true"></ion-icon>
                  <ion-icon slot="start" name="heart" aria-hidden="true"></ion-icon>
                  <ion-button slot="end" aria-label="Show/hide password">
                    <ion-icon slot="icon-only" name="lock-closed" aria-hidden="true"></ion-icon>
                  </ion-button>
                  <ion-button slot="end">
                    <ion-icon slot="icon-only" name="trash" aria-hidden="true"></ion-icon>
                  </ion-button>
                </ion-textarea>
              </div>
            `,
            config
          );

          const container = page.locator('.container');
          await expect(container).toHaveScreenshot(screenshot(`textarea-slot-fill-${fill}-label-start-value`));
        });

        test('should not have visual regressions with a floating label', async ({ page }) => {
          await page.setContent(
            `
              <!-- Apply container styles to capture the entire textarea -->
              <style>
                .container {
                  padding: 8px;
                }
              </style>

              <div class="container">
                <ion-textarea label-placement="floating" fill="${fill}" label="Weight">
                  <ion-icon slot="start" name="barbell" aria-hidden="true"></ion-icon>
                  <ion-icon slot="start" name="heart" aria-hidden="true"></ion-icon>
                  <ion-button slot="end" aria-label="Show/hide password">
                    <ion-icon slot="icon-only" name="lock-closed" aria-hidden="true"></ion-icon>
                  </ion-button>
                  <ion-button slot="end">
                    <ion-icon slot="icon-only" name="trash" aria-hidden="true"></ion-icon>
                  </ion-button>
                </ion-textarea>
              </div>
            `,
            config
          );

          const container = page.locator('.container');
          await expect(container).toHaveScreenshot(screenshot(`textarea-slot-fill-${fill}-label-floating`));
        });

        test('should not have visual regressions with a floating label when value is present', async ({ page }) => {
          await page.setContent(
            `
              <!-- Apply container styles to capture the entire textarea -->
              <style>
                .container {
                  padding: 8px;
                }
              </style>

              <div class="container">
                <ion-textarea label-placement="floating" fill="${fill}" value="100" label="Weight">
                  <ion-icon slot="start" name="barbell" aria-hidden="true"></ion-icon>
                  <ion-icon slot="start" name="heart" aria-hidden="true"></ion-icon>
                  <ion-button slot="end" aria-label="Show/hide password">
                    <ion-icon slot="icon-only" name="lock-closed" aria-hidden="true"></ion-icon>
                  </ion-button>
                  <ion-button slot="end">
                    <ion-icon slot="icon-only" name="trash" aria-hidden="true"></ion-icon>
                  </ion-button>
                </ion-textarea>
              </div>
            `,
            config
          );

          const container = page.locator('.container');
          await expect(container).toHaveScreenshot(screenshot(`textarea-slot-fill-${fill}-label-floating-value`));
        });
      });
    });

    test.describe('start container adjustment', () => {
      test('should set CSS variable for outline fill with start slot', async ({ page }) => {
        await page.setContent(
          `
            <ion-textarea fill="outline" label="Test" label-placement="floating">
              <ion-icon slot="start" name="search" aria-hidden="true"></ion-icon>
            </ion-textarea>
          `,
          config
        );

        const textarea = page.locator('ion-textarea');
        const adjustment = await textarea.evaluate((el: any) => {
          const computedStyle = window.getComputedStyle(el);
          return computedStyle.getPropertyValue('--internal-start-container-adjustment');
        });

        expect(adjustment).toMatch(/-?\d+\.?\d*px/);
      });

      test('should update CSS variable when start slot width changes', async ({ page }) => {
        await page.setContent(
          `
            <ion-textarea fill="outline" label="Test" label-placement="floating">
              <div id="start-slot" slot="start" style="width: 32px; height: 40px; background: #f0f0f0;"></div>
            </ion-textarea>
          `,
          config
        );

        const textarea = page.locator('ion-textarea');

        // Get initial adjustment value
        const initialValue = await textarea.evaluate((el: any) => {
          const computedStyle = window.getComputedStyle(el);
          return computedStyle.getPropertyValue('--internal-start-container-adjustment');
        });

        // Change the width of the start slot
        await page.evaluate(() => {
          const slot = document.getElementById('start-slot') as HTMLElement;
          slot.style.width = '64px';
        });

        // Wait for ResizeObserver to trigger the measurement
        await page.waitForTimeout(300);

        const updatedValue = await textarea.evaluate((el: any) => {
          const computedStyle = window.getComputedStyle(el);
          return computedStyle.getPropertyValue('--internal-start-container-adjustment');
        });

        // Values should be different (64px adjustment vs 32px adjustment)
        expect(initialValue).not.toBe(updatedValue);
      });
    });
  });
});
