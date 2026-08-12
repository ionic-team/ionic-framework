import type { Locator } from '@playwright/test';
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
  });
});

/**
 * The outline fill is only supported by `md` mode.
 */
configs({ modes: ['md'] }).forEach(({ title, config }) => {
  test.describe(title('textarea: slot: start container adjustment'), () => {
    /**
     * The label is shifted back over the outline notch by the start
     * container width, so the offset is negative in LTR and positive in RTL.
     */
    const sign = config.direction === 'rtl' ? '' : '-';

    /**
     * Returns the value of the --internal-start-container-adjustment
     * CSS property as a CSS length string (e.g. `-48px`).
     */
    const getCssAdjustmentValue = (textarea: Locator) =>
      textarea.evaluate((el: HTMLIonTextareaElement) =>
        window.getComputedStyle(el).getPropertyValue('--internal-start-container-adjustment')
      );

    /**
     * Gets the width of the `.textarea-start` container, mirroring the
     * rounding the controller applies so that fractional widths do
     * not produce a mismatch.
     */
    const getStartWidth = (textarea: Locator) =>
      textarea
        .locator('.textarea-start')
        .evaluate((el: HTMLElement) => Math.round(el.getBoundingClientRect().width * 10) / 10);

    test('should match the measured start container width', async ({ page }) => {
      await page.setContent(
        `
          <ion-textarea label-placement="floating" fill="outline" label="Weight">
            <div slot="start" style="width: 32px; height: 40px;"></div>
          </ion-textarea>
        `,
        config
      );

      const textarea = page.locator('ion-textarea');
      const startWidth = await getStartWidth(textarea);

      /**
       * The stylesheet declares the property as 0px, so a zero-width container
       * could cause the CSS assertion below to pass even if the measurement
       * never ran.
       */
      expect(startWidth).toBeGreaterThan(0);

      await expect.poll(() => getCssAdjustmentValue(textarea)).toBe(`${sign}${startWidth}px`);
    });

    test('should update when the start slot width changes', async ({ page }) => {
      await page.setContent(
        `
          <ion-textarea label-placement="floating" fill="outline" label="Weight">
            <div id="start-slot" slot="start" style="width: 32px; height: 40px;"></div>
          </ion-textarea>
        `,
        config
      );

      const textarea = page.locator('ion-textarea');
      const initialWidth = await getStartWidth(textarea);

      await expect.poll(() => getCssAdjustmentValue(textarea)).toBe(`${sign}${initialWidth}px`);

      // Change the width of the start slot
      await page.evaluate(() => {
        const slot = document.getElementById('start-slot')!;
        slot.style.width = '64px';
      });

      const updatedWidth = await getStartWidth(textarea);
      expect(updatedWidth).toBe(initialWidth + 32);

      await expect.poll(() => getCssAdjustmentValue(textarea)).toBe(`${sign}${updatedWidth}px`);
    });

    test('should update when a start slot is added dynamically', async ({ page }) => {
      await page.setContent(
        `
          <ion-textarea label-placement="floating" fill="outline" value="100" label="Weight"></ion-textarea>
        `,
        config
      );

      const textarea = page.locator('ion-textarea');

      // Nothing is slotted yet, so there is no width to offset the label by
      await expect.poll(() => getCssAdjustmentValue(textarea)).toBe('0px');

      // Dynamically add a start slot with content
      await page.evaluate(() => {
        const textareaEl = document.querySelector('ion-textarea')!;
        const startSlot = document.createElement('div');
        startSlot.setAttribute('slot', 'start');
        startSlot.style.width = '32px';
        startSlot.style.height = '40px';
        textareaEl.appendChild(startSlot);
      });

      /**
       * Wait for the skip-label-transition class to be removed to verify
       * the label animation is no longer disabled.
       */
      await page.waitForFunction(
        () => {
          const el = document.querySelector('ion-textarea');
          return !el?.classList.contains('skip-label-transition');
        },
        { timeout: 2000 }
      );

      const startWidth = await getStartWidth(textarea);

      /**
       * The stylesheet declares the property as 0px, so a zero-width container
       * could cause the CSS assertion below to pass even if the measurement
       * never ran.
       */
      expect(startWidth).toBeGreaterThan(0);

      await expect.poll(() => getCssAdjustmentValue(textarea)).toBe(`${sign}${startWidth}px`);
    });
  });
});

/**
 * Functional checks do not vary by mode or direction.
 */
configs({ modes: ['md'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('textarea: slot: label floating'), () => {
    test.describe('label-placement: floating', () => {
      test('should not raise floating label when unfocused with no value and no slots', async ({ page }) => {
        await page.setContent(
          `
            <ion-textarea label-placement="floating" label="Weight"></ion-textarea>
          `,
          config
        );

        const textarea = page.locator('ion-textarea');
        await expect(textarea).not.toHaveClass(/label-floating/);
      });

      test('should not raise floating label when unfocused with no value and only a start slot', async ({ page }) => {
        await page.setContent(
          `
            <ion-textarea label-placement="floating" label="Weight">
              <ion-icon slot="start" name="barbell" aria-hidden="true"></ion-icon>
            </ion-textarea>
          `,
          config
        );

        const textarea = page.locator('ion-textarea');
        await expect(textarea).not.toHaveClass(/label-floating/);
      });

      test('should not raise floating label when unfocused with no value and only an end slot', async ({ page }) => {
        await page.setContent(
          `
            <ion-textarea label-placement="floating" label="Weight">
              <ion-icon slot="end" name="lock-closed" aria-hidden="true"></ion-icon>
            </ion-textarea>
          `,
          config
        );

        const textarea = page.locator('ion-textarea');
        await expect(textarea).not.toHaveClass(/label-floating/);
      });

      test('should raise floating label when value is present', async ({ page }) => {
        await page.setContent(
          `
            <ion-textarea label-placement="floating" value="100" label="Weight"></ion-textarea>
          `,
          config
        );

        const textarea = page.locator('ion-textarea');
        await expect(textarea).toHaveClass(/label-floating/);
      });

      test('should raise floating label when value and start slot are present', async ({ page }) => {
        await page.setContent(
          `
            <ion-textarea label-placement="floating" value="100" label="Weight">
              <ion-icon slot="start" name="barbell" aria-hidden="true"></ion-icon>
            </ion-textarea>
          `,
          config
        );

        const textarea = page.locator('ion-textarea');
        await expect(textarea).toHaveClass(/label-floating/);
      });

      test('should raise floating label when value and end slot are present', async ({ page }) => {
        await page.setContent(
          `
            <ion-textarea label-placement="floating" value="100" label="Weight">
              <ion-icon slot="end" name="lock-closed" aria-hidden="true"></ion-icon>
            </ion-textarea>
          `,
          config
        );

        const textarea = page.locator('ion-textarea');
        await expect(textarea).toHaveClass(/label-floating/);
      });

      test('should raise floating label when focused with no value', async ({ page }) => {
        await page.setContent(
          `
            <ion-textarea label-placement="floating" label="Weight">
              <ion-icon slot="start" name="barbell" aria-hidden="true"></ion-icon>
            </ion-textarea>
          `,
          config
        );

        const textarea = page.locator('ion-textarea');
        const nativeTextarea = page.locator('textarea');

        // Label should not float by default
        await expect(textarea).not.toHaveClass(/label-floating/);

        // Focus the textarea and check that label is now floating
        await nativeTextarea.focus();
        await expect(textarea).toHaveClass(/label-floating/);
      });
    });

    test.describe('label-placement: stacked', () => {
      test('should always have floating label regardless of value or focus', async ({ page }) => {
        await page.setContent(
          `
            <ion-textarea label-placement="stacked" label="Weight"></ion-textarea>
          `,
          config
        );

        const textarea = page.locator('ion-textarea');
        const nativeTextarea = page.locator('textarea');

        // Stacked label should always float, even when empty and unfocused
        await expect(textarea).toHaveClass(/label-floating/);

        // Focus shouldn't change it (still floats)
        await nativeTextarea.focus();
        await expect(textarea).toHaveClass(/label-floating/);

        // Blur shouldn't change it (still floats)
        await nativeTextarea.blur();
        await expect(textarea).toHaveClass(/label-floating/);
      });

      test('should always have floating label with start slot', async ({ page }) => {
        await page.setContent(
          `
            <ion-textarea label-placement="stacked" label="Weight">
              <ion-icon slot="start" name="barbell" aria-hidden="true"></ion-icon>
            </ion-textarea>
          `,
          config
        );

        const textarea = page.locator('ion-textarea');
        await expect(textarea).toHaveClass(/label-floating/);
      });

      test('should always have floating label with end slot', async ({ page }) => {
        await page.setContent(
          `
            <ion-textarea label-placement="stacked" label="Weight">
              <ion-icon slot="end" name="lock-closed" aria-hidden="true"></ion-icon>
            </ion-textarea>
          `,
          config
        );

        const textarea = page.locator('ion-textarea');
        await expect(textarea).toHaveClass(/label-floating/);
      });
    });
  });
});
