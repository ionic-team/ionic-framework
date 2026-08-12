import type { Locator } from '@playwright/test';
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
  });
});

/**
 * The outline fill is only supported by `md` mode.
 */
configs({ modes: ['md'] }).forEach(({ title, config }) => {
  test.describe(title('select: slot: start container adjustment'), () => {
    /**
     * The label is shifted back over the outline notch by the start
     * container width, so the offset is negative in LTR and positive in RTL.
     */
    const sign = config.direction === 'rtl' ? '' : '-';

    /**
     * Returns the value of the --internal-start-container-adjustment
     * CSS property as a CSS length string (e.g. `-48px`).
     */
    const getCssAdjustmentValue = (select: Locator) =>
      select.evaluate((el: HTMLIonSelectElement) =>
        window.getComputedStyle(el).getPropertyValue('--internal-start-container-adjustment')
      );

    /**
     * Gets the width of the `.select-start` container, mirroring the
     * rounding the controller applies so that fractional widths do
     * not produce a mismatch.
     */
    const getStartWidth = (select: Locator) =>
      select
        .locator('.select-start')
        .evaluate((el: HTMLElement) => Math.round(el.getBoundingClientRect().width * 10) / 10);

    test('should match the measured start container width', async ({ page }) => {
      await page.setContent(
        `
          <ion-select label-placement="floating" fill="outline" label="Weight">
            <div slot="start" style="width: 32px; height: 40px;"></div>
            <ion-select-option value="100">100</ion-select-option>
            <ion-select-option value="200">200</ion-select-option>
            <ion-select-option value="300">300</ion-select-option>
          </ion-select>
        `,
        config
      );

      const select = page.locator('ion-select');
      const startWidth = await getStartWidth(select);

      /**
       * The stylesheet declares the property as 0px, so a zero-width container
       * could cause the CSS assertion below to pass even if the measurement
       * never ran.
       */
      expect(startWidth).toBeGreaterThan(0);

      await expect.poll(() => getCssAdjustmentValue(select)).toBe(`${sign}${startWidth}px`);
    });

    test('should measure when the fill resolves after the component connects', async ({ page }) => {
      await page.setContent(
        `
          <ion-select label-placement="floating" label="Weight">
            <div slot="start" style="width: 32px; height: 40px;"></div>
            <ion-select-option value="100">100</ion-select-option>
            <ion-select-option value="200">200</ion-select-option>
            <ion-select-option value="300">300</ion-select-option>
          </ion-select>
        `,
        config
      );

      const select = page.locator('ion-select');

      await select.evaluate((el: HTMLIonSelectElement) => {
        el.fill = 'outline';
      });

      const startWidth = await getStartWidth(select);
      expect(startWidth).toBeGreaterThan(0);

      await expect.poll(() => getCssAdjustmentValue(select)).toBe(`${sign}${startWidth}px`);
    });

    test('should observe the start slot when the fill resolves after the component connects', async ({ page }) => {
      await page.setContent(
        `
          <ion-select label-placement="floating" label="Weight">
            <div id="start-slot" slot="start" style="width: 32px; height: 40px;"></div>
            <ion-select-option value="100">100</ion-select-option>
            <ion-select-option value="200">200</ion-select-option>
            <ion-select-option value="300">300</ion-select-option>
          </ion-select>
        `,
        config
      );

      const select = page.locator('ion-select');

      await select.evaluate((el: HTMLIonSelectElement) => {
        el.fill = 'outline';
      });

      const initialWidth = await getStartWidth(select);
      await expect.poll(() => getCssAdjustmentValue(select)).toBe(`${sign}${initialWidth}px`);

      await page.evaluate(() => {
        const slot = document.getElementById('start-slot')!;
        slot.style.width = '64px';
      });

      const updatedWidth = await getStartWidth(select);
      expect(updatedWidth).toBe(initialWidth + 32);

      await expect.poll(() => getCssAdjustmentValue(select)).toBe(`${sign}${updatedWidth}px`);
    });

    test('should clear the adjustment when the fill stops being outline', async ({ page }) => {
      await page.setContent(
        `
          <ion-select label-placement="floating" fill="outline" label="Weight">
            <div slot="start" style="width: 32px; height: 40px;"></div>
            <ion-select-option value="100">100</ion-select-option>
            <ion-select-option value="200">200</ion-select-option>
            <ion-select-option value="300">300</ion-select-option>
          </ion-select>
        `,
        config
      );

      const select = page.locator('ion-select');
      const startWidth = await getStartWidth(select);

      await expect.poll(() => getCssAdjustmentValue(select)).toBe(`${sign}${startWidth}px`);

      await select.evaluate((el: HTMLIonSelectElement) => {
        el.fill = 'solid';
      });

      await expect.poll(() => getCssAdjustmentValue(select)).toBe('');
    });

    test('should update when the start slot width changes', async ({ page }) => {
      await page.setContent(
        `
          <ion-select label-placement="floating" fill="outline" label="Weight">
            <div id="start-slot" slot="start" style="width: 32px; height: 40px;"></div>
            <ion-select-option value="100">100</ion-select-option>
            <ion-select-option value="200">200</ion-select-option>
            <ion-select-option value="300">300</ion-select-option>
          </ion-select>
        `,
        config
      );

      const select = page.locator('ion-select');
      const initialWidth = await getStartWidth(select);

      await expect.poll(() => getCssAdjustmentValue(select)).toBe(`${sign}${initialWidth}px`);

      // Change the width of the start slot
      await page.evaluate(() => {
        const slot = document.getElementById('start-slot')!;
        slot.style.width = '64px';
      });

      const updatedWidth = await getStartWidth(select);
      expect(updatedWidth).toBe(initialWidth + 32);

      await expect.poll(() => getCssAdjustmentValue(select)).toBe(`${sign}${updatedWidth}px`);
    });

    test('should update when a start slot is added dynamically', async ({ page }) => {
      await page.setContent(
        `
          <ion-select label-placement="floating" fill="outline" value="100" label="Weight">
            <ion-select-option value="100">100</ion-select-option>
            <ion-select-option value="200">200</ion-select-option>
            <ion-select-option value="300">300</ion-select-option>
          </ion-select>
        `,
        config
      );

      const select = page.locator('ion-select');

      // Nothing is slotted yet, so there is no width to offset the label by
      await expect.poll(() => getCssAdjustmentValue(select)).toBe('0px');

      // Dynamically add a start slot with content
      await page.evaluate(() => {
        const selectEl = document.querySelector('ion-select')!;
        const startSlot = document.createElement('div');
        startSlot.setAttribute('slot', 'start');
        startSlot.style.width = '32px';
        startSlot.style.height = '40px';
        selectEl.appendChild(startSlot);
      });

      /**
       * Wait for the skip-label-transition class to be removed to verify
       * the label animation is no longer disabled.
       */
      await page.waitForFunction(
        () => {
          const el = document.querySelector('ion-select');
          return !el?.classList.contains('skip-label-transition');
        },
        { timeout: 2000 }
      );

      const startWidth = await getStartWidth(select);

      /**
       * The stylesheet declares the property as 0px, so a zero-width container
       * could cause the CSS assertion below to pass even if the measurement
       * never ran.
       */
      expect(startWidth).toBeGreaterThan(0);

      await expect.poll(() => getCssAdjustmentValue(select)).toBe(`${sign}${startWidth}px`);
    });
  });
});

/**
 * Functional checks do not vary by mode or direction.
 */
configs({ modes: ['md'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('select: slot: interactive elements'), () => {
    test('should not open select when slotted buttons are clicked', async ({ page }) => {
      await page.setContent(
        `
          <ion-select label="Favorite Pizza" placeholder="Select a pizza">
            <ion-select-option value="pepperoni">Pepperoni</ion-select-option>
            <ion-select-option value="supreme">Supreme</ion-select-option>
            <ion-select-option value="chicken">Chicken</ion-select-option>
            <ion-button fill="clear" slot="end" aria-label="Show/hide password">
              <ion-icon slot="icon-only" name="eye" aria-hidden="true"></ion-icon>
            </ion-button>
          </ion-select>
        `,
        config
      );

      await page.click('ion-select ion-button[slot="end"]');
      await page.waitForChanges();

      const select = page.locator('ion-select');
      await expect(select).not.toHaveClass(/select-expanded/);
    });
  });

  test.describe(title('select: slot: label floating'), () => {
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
