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
      await expect(select).toHaveScreenshot(screenshot(`select-slot-label-floating-value`));
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

    test.describe('start container adjustment', () => {
      test('should set CSS variable for outline fill with start slot', async ({ page }) => {
        await page.setContent(
          `
            <ion-select fill="outline" label="Test" label-placement="floating">
              <ion-icon slot="start" name="search" aria-hidden="true"></ion-icon>
            </ion-select>
          `,
          config
        );

        const select = page.locator('ion-select');
        const adjustment = await select.evaluate((el: any) => {
          const computedStyle = window.getComputedStyle(el);
          return computedStyle.getPropertyValue('--internal-start-container-adjustment');
        });

        expect(adjustment).toMatch(/-?\d+\.?\d*px/);
      });

      test('should update CSS variable when start slot width changes', async ({ page }) => {
        await page.setContent(
          `
            <ion-select fill="outline" label="Test" label-placement="floating">
              <div id="start-slot" slot="start" style="width: 32px; height: 40px; background: #f0f0f0;"></div>
            </ion-select>
          `,
          config
        );

        const select = page.locator('ion-select');

        // Get initial adjustment value
        const initialValue = await select.evaluate((el: any) => {
          const computedStyle = window.getComputedStyle(el);
          return computedStyle.getPropertyValue('--internal-start-container-adjustment');
        });

        // Change the width of the start slot
        await page.evaluate(() => {
          const slot = document.getElementById('start-slot') as HTMLElement;
          slot.style.width = '64px';
        });

        // Wait for ResizeObserver to trigger the measurement
        await page.waitForChanges();

        const updatedValue = await select.evaluate((el: any) => {
          const computedStyle = window.getComputedStyle(el);
          return computedStyle.getPropertyValue('--internal-start-container-adjustment');
        });

        // Values should be different (64px adjustment vs 32px adjustment)
        expect(initialValue).not.toBe(updatedValue);
      });
    });

    test('should update CSS variable when slot is dynamically added', async ({ page }) => {
      await page.setContent(
        `
          <ion-select label-placement="floating" value="100" label="Weight" fill="outline">
            <ion-select-option value="100">100</ion-select-option>
            <ion-select-option value="200">200</ion-select-option>
            <ion-select-option value="300">300</ion-select-option>
          </ion-select>
        `,
        config
      );

      const select = page.locator('ion-select');

      // Get initial CSS variable value
      const initialValue = await select.evaluate((el: any) => {
        const computedStyle = window.getComputedStyle(el);
        return computedStyle.getPropertyValue('--internal-start-container-adjustment');
      });

      // Dynamically add a start slot with content
      await page.evaluate(() => {
        const selectEl = document.querySelector('ion-select') as any;
        const icon = document.createElement('ion-icon');
        icon.setAttribute('slot', 'start');
        icon.setAttribute('name', 'search');
        icon.style.width = '40px';
        selectEl.appendChild(icon);
      });

      // Wait for skip-label-transition class to be removed
      // to verify the label animation is no longer disabled
      await page.waitForFunction(
        () => {
          const el = document.querySelector('ion-select') as any;
          return !el?.classList.contains('skip-label-transition');
        },
        { timeout: 2000 }
      );

      // Get updated CSS variable value
      const updatedValue = await select.evaluate((el: any) => {
        const computedStyle = window.getComputedStyle(el);
        return computedStyle.getPropertyValue('--internal-start-container-adjustment');
      });

      // CSS variable should be updated after slot addition
      expect(initialValue).not.toBe(updatedValue);

      // Updated value should reflect the start slot width
      expect(updatedValue).toMatch(/-?\d+\.?\d*px/);
    });
  });
});

/**
 * Functional checks do not vary by mode or direction.
 */
configs({ modes: ['md'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('select: label floating behavior with slots'), () => {
    test.describe('label-placement: floating', () => {
      test('should not raise floating label when unfocused with no value and no slots', async ({ page }) => {
        await page.setContent(
          `
            <ion-select label-placement="floating" label="Weight">
              <ion-select-option value="100">100</ion-select-option>
              <ion-select-option value="200">200</ion-select-option>
              <ion-select-option value="300">300</ion-select-option>
            </ion-select>
          `,
          config
        );

        const select = page.locator('ion-select');
        await expect(select).not.toHaveClass(/label-floating/);
      });

      test('should not raise floating label when unfocused with no value and only a start slot', async ({ page }) => {
        await page.setContent(
          `
            <ion-select label-placement="floating" label="Weight">
              <ion-icon slot="start" name="barbell" aria-hidden="true"></ion-icon>
              <ion-select-option value="100">100</ion-select-option>
              <ion-select-option value="200">200</ion-select-option>
              <ion-select-option value="300">300</ion-select-option>
            </ion-select>
          `,
          config
        );

        const select = page.locator('ion-select');
        await expect(select).not.toHaveClass(/label-floating/);
      });

      test('should not raise floating label when unfocused with no value and only an end slot', async ({ page }) => {
        await page.setContent(
          `
            <ion-select label-placement="floating" label="Weight">
              <ion-select-option value="100">100</ion-select-option>
              <ion-select-option value="200">200</ion-select-option>
              <ion-select-option value="300">300</ion-select-option>
              <ion-icon slot="end" name="lock-closed" aria-hidden="true"></ion-icon>
            </ion-select>
          `,
          config
        );

        const select = page.locator('ion-select');
        await expect(select).not.toHaveClass(/label-floating/);
      });

      test('should raise floating label when value is present', async ({ page }) => {
        await page.setContent(
          `
            <ion-select label-placement="floating" value="100" label="Weight">
              <ion-select-option value="100">100</ion-select-option>
              <ion-select-option value="200">200</ion-select-option>
              <ion-select-option value="300">300</ion-select-option>
            </ion-select>
          `,
          config
        );

        const select = page.locator('ion-select');
        await expect(select).toHaveClass(/label-floating/);
      });

      test('should raise floating label when value and start slot are present', async ({ page }) => {
        await page.setContent(
          `
            <ion-select label-placement="floating" value="100" label="Weight">
              <ion-icon slot="start" name="barbell" aria-hidden="true"></ion-icon>
              <ion-select-option value="100">100</ion-select-option>
              <ion-select-option value="200">200</ion-select-option>
              <ion-select-option value="300">300</ion-select-option>
            </ion-select>
          `,
          config
        );

        const select = page.locator('ion-select');
        await expect(select).toHaveClass(/label-floating/);
      });

      test('should raise floating label when value and end slot are present', async ({ page }) => {
        await page.setContent(
          `
            <ion-select label-placement="floating" value="100" label="Weight">
              <ion-select-option value="100">100</ion-select-option>
              <ion-select-option value="200">200</ion-select-option>
              <ion-select-option value="300">300</ion-select-option>
              <ion-icon slot="end" name="lock-closed" aria-hidden="true"></ion-icon>
            </ion-select>
          `,
          config
        );

        const select = page.locator('ion-select');
        await expect(select).toHaveClass(/label-floating/);
      });

      test('should raise floating label when focused with no value', async ({ page }) => {
        await page.setContent(
          `
            <ion-select label-placement="floating" label="Weight">
              <ion-icon slot="start" name="barbell" aria-hidden="true"></ion-icon>
              <ion-select-option value="100">100</ion-select-option>
              <ion-select-option value="200">200</ion-select-option>
              <ion-select-option value="300">300</ion-select-option>
            </ion-select>
          `,
          config
        );

        const select = page.locator('ion-select');

        // Label should not float by default
        await expect(select).not.toHaveClass(/label-floating/);

        // Focus the select and check that label is now floating
        await select.click();
        await expect(select).toHaveClass(/label-floating/);
      });
    });

    test.describe('label-placement: stacked', () => {
      test('should always have floating label regardless of value or focus', async ({ page }) => {
        await page.setContent(
          `
            <ion-select label-placement="stacked" label="Weight">
              <ion-select-option value="100">100</ion-select-option>
              <ion-select-option value="200">200</ion-select-option>
              <ion-select-option value="300">300</ion-select-option>
            </ion-select>
          `,
          config
        );

        const select = page.locator('ion-select');

        // Stacked label should always float, even when empty and unfocused
        await expect(select).toHaveClass(/label-floating/);

        // Focus shouldn't change it (still floats)
        await select.click();
        await expect(select).toHaveClass(/label-floating/);

        // Escaping shouldn't change it (still floats)
        await page.keyboard.press('Escape');
        await expect(select).toHaveClass(/label-floating/);
      });

      test('should always have floating label with start slot', async ({ page }) => {
        await page.setContent(
          `
            <ion-select label-placement="stacked" label="Weight">
              <ion-icon slot="start" name="barbell" aria-hidden="true"></ion-icon>
              <ion-select-option value="100">100</ion-select-option>
              <ion-select-option value="200">200</ion-select-option>
              <ion-select-option value="300">300</ion-select-option>
            </ion-select>
          `,
          config
        );

        const select = page.locator('ion-select');
        await expect(select).toHaveClass(/label-floating/);
      });

      test('should always have floating label with end slot', async ({ page }) => {
        await page.setContent(
          `
            <ion-select label-placement="stacked" label="Weight">
              <ion-select-option value="100">100</ion-select-option>
              <ion-select-option value="200">200</ion-select-option>
              <ion-select-option value="300">300</ion-select-option>
              <ion-icon slot="end" name="lock-closed" aria-hidden="true"></ion-icon>
            </ion-select>
          `,
          config
        );

        const select = page.locator('ion-select');
        await expect(select).toHaveClass(/label-floating/);
      });
    });
  });
});
