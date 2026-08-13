import type { Locator } from '@playwright/test';
import { expect } from '@playwright/test';
import type { E2EPage } from '@utils/test/playwright';
import { configs, test } from '@utils/test/playwright';

configs().forEach(({ title, screenshot, config }) => {
  test.describe(title('input: slot'), () => {
    test('should not have visual regressions with a start-positioned label', async ({ page }) => {
      await page.setContent(
        `
          <ion-input label-placement="start" label="Weight" clear-input="true">
            <ion-icon slot="start" name="barbell" aria-hidden="true"></ion-icon>
            <ion-icon slot="start" name="heart" aria-hidden="true"></ion-icon>
            <ion-button slot="end" aria-label="Show/hide password">
              <ion-icon slot="icon-only" name="lock-closed" aria-hidden="true"></ion-icon>
            </ion-button>
            <ion-button slot="end">
              <ion-icon slot="icon-only" name="trash" aria-hidden="true"></ion-icon>
            </ion-button>
          </ion-input>
        `,
        config
      );

      const input = page.locator('ion-input');
      await expect(input).toHaveScreenshot(screenshot(`input-slot-label-start`));
    });

    test('should not have visual regressions with a start-positioned label when value is present', async ({ page }) => {
      await page.setContent(
        `
          <ion-input label-placement="start" value="100" label="Weight" clear-input="true">
            <ion-icon slot="start" name="barbell" aria-hidden="true"></ion-icon>
            <ion-icon slot="start" name="heart" aria-hidden="true"></ion-icon>
            <ion-button slot="end" aria-label="Show/hide password">
              <ion-icon slot="icon-only" name="lock-closed" aria-hidden="true"></ion-icon>
            </ion-button>
            <ion-button slot="end">
              <ion-icon slot="icon-only" name="trash" aria-hidden="true"></ion-icon>
            </ion-button>
          </ion-input>
        `,
        config
      );

      const input = page.locator('ion-input');
      await expect(input).toHaveScreenshot(screenshot(`input-slot-label-start-value`));
    });

    test('should not have visual regressions with a floating label', async ({ page }) => {
      await page.setContent(
        `
          <ion-input label-placement="floating" label="Weight" clear-input="true">
            <ion-icon slot="start" name="barbell" aria-hidden="true"></ion-icon>
            <ion-icon slot="start" name="heart" aria-hidden="true"></ion-icon>
            <ion-button slot="end" aria-label="Show/hide password">
              <ion-icon slot="icon-only" name="lock-closed" aria-hidden="true"></ion-icon>
            </ion-button>
            <ion-button slot="end">
              <ion-icon slot="icon-only" name="trash" aria-hidden="true"></ion-icon>
            </ion-button>
          </ion-input>
        `,
        config
      );

      const input = page.locator('ion-input');
      await expect(input).toHaveScreenshot(screenshot(`input-slot-label-floating`));
    });

    test('should not have visual regressions with a floating label when value is present', async ({ page }) => {
      await page.setContent(
        `
          <ion-input label-placement="floating" value="100" label="Weight" clear-input="true">
            <ion-icon slot="start" name="barbell" aria-hidden="true"></ion-icon>
            <ion-icon slot="start" name="heart" aria-hidden="true"></ion-icon>
            <ion-button slot="end" aria-label="Show/hide password">
              <ion-icon slot="icon-only" name="lock-closed" aria-hidden="true"></ion-icon>
            </ion-button>
            <ion-button slot="end">
              <ion-icon slot="icon-only" name="trash" aria-hidden="true"></ion-icon>
            </ion-button>
          </ion-input>
        `,
        config
      );

      const input = page.locator('ion-input');
      await expect(input).toHaveScreenshot(screenshot(`input-slot-label-floating-value`));
    });
  });
});

/**
 * The solid and outline fills are only supported by `md` mode.
 */
configs({ modes: ['md'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('input: slot'), () => {
    ['solid', 'outline'].forEach((fill) => {
      test.describe(`fill: ${fill}`, () => {
        test('should not have visual regressions with a start-positioned label', async ({ page }) => {
          await page.setContent(
            `
              <!-- Apply container styles to capture the entire input -->
              <style>
                .container {
                  padding: 8px;
                }
              </style>

              <div class="container">
                <ion-input label-placement="start" fill="${fill}" label="Weight" clear-input="true">
                  <ion-icon slot="start" name="barbell" aria-hidden="true"></ion-icon>
                  <ion-icon slot="start" name="heart" aria-hidden="true"></ion-icon>
                  <ion-button slot="end" aria-label="Show/hide password">
                    <ion-icon slot="icon-only" name="lock-closed" aria-hidden="true"></ion-icon>
                  </ion-button>
                  <ion-button slot="end">
                    <ion-icon slot="icon-only" name="trash" aria-hidden="true"></ion-icon>
                  </ion-button>
                </ion-input>
              </div>
            `,
            config
          );

          const container = page.locator('.container');
          await expect(container).toHaveScreenshot(screenshot(`input-slot-fill-${fill}-label-start`));
        });

        test('should not have visual regressions with a start-positioned label when value is present', async ({
          page,
        }) => {
          await page.setContent(
            `
              <!-- Apply container styles to capture the entire input -->
              <style>
                .container {
                  padding: 8px;
                }
              </style>

              <div class="container">
                <ion-input label-placement="start" fill="${fill}" value="100" label="Weight" clear-input="true">
                  <ion-icon slot="start" name="barbell" aria-hidden="true"></ion-icon>
                  <ion-icon slot="start" name="heart" aria-hidden="true"></ion-icon>
                  <ion-button slot="end" aria-label="Show/hide password">
                    <ion-icon slot="icon-only" name="lock-closed" aria-hidden="true"></ion-icon>
                  </ion-button>
                  <ion-button slot="end">
                    <ion-icon slot="icon-only" name="trash" aria-hidden="true"></ion-icon>
                  </ion-button>
                </ion-input>
              </div>
            `,
            config
          );

          const container = page.locator('.container');
          await expect(container).toHaveScreenshot(screenshot(`input-slot-fill-${fill}-label-start-value`));
        });

        test('should not have visual regressions with a floating label', async ({ page }) => {
          await page.setContent(
            `
              <!-- Apply container styles to capture the entire input -->
              <style>
                .container {
                  padding: 8px;
                }
              </style>

              <div class="container">
                <ion-input label-placement="floating" fill="${fill}" label="Weight" clear-input="true">
                  <ion-icon slot="start" name="barbell" aria-hidden="true"></ion-icon>
                  <ion-icon slot="start" name="heart" aria-hidden="true"></ion-icon>
                  <ion-button slot="end" aria-label="Show/hide password">
                    <ion-icon slot="icon-only" name="lock-closed" aria-hidden="true"></ion-icon>
                  </ion-button>
                  <ion-button slot="end">
                    <ion-icon slot="icon-only" name="trash" aria-hidden="true"></ion-icon>
                  </ion-button>
                </ion-input>
              </div>
            `,
            config
          );

          const container = page.locator('.container');
          await expect(container).toHaveScreenshot(screenshot(`input-slot-fill-${fill}-label-floating`));
        });

        test('should not have visual regressions with a floating label when value is present', async ({ page }) => {
          await page.setContent(
            `
              <!-- Apply container styles to capture the entire input -->
              <style>
                .container {
                  padding: 8px;
                }
              </style>

              <div class="container">
                <ion-input label-placement="floating" fill="${fill}" value="100" label="Weight" clear-input="true">
                  <ion-icon slot="start" name="barbell" aria-hidden="true"></ion-icon>
                  <ion-icon slot="start" name="heart" aria-hidden="true"></ion-icon>
                  <ion-button slot="end" aria-label="Show/hide password">
                    <ion-icon slot="icon-only" name="lock-closed" aria-hidden="true"></ion-icon>
                  </ion-button>
                  <ion-button slot="end">
                    <ion-icon slot="icon-only" name="trash" aria-hidden="true"></ion-icon>
                  </ion-button>
                </ion-input>
              </div>
            `,
            config
          );

          const container = page.locator('.container');
          await expect(container).toHaveScreenshot(screenshot(`input-slot-fill-${fill}-label-floating-value`));
        });
      });
    });
  });
});

/**
 * The outline fill is only supported by `md` mode.
 * The overflow behavior is the same regardless of direction.
 */
configs({ modes: ['md'], directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('input: slot: overflow'), () => {
    /**
     * Wide enough that the label cannot fit beside it, and given a
     * background so that a slot pushed outside of the border is visible
     * in the screenshot.
     */
    const startSlot = `<div slot="start" style="width: 150px; height: 10px; background: lightpink"></div>`;
    const endSlot = `<div slot="end" style="width: 150px; height: 10px; background: lightblue"></div>`;

    const setContent = async (page: E2EPage, props: string, slot: string) => {
      await page.setContent(
        `
          <!-- Apply container styles to capture the entire input -->
          <style>
            .container {
              padding: 8px;
            }
          </style>

          <div class="container">
            <ion-input
              fill="outline"
              label="Email Address"
              style="width: 260px"
              ${props}
            >
              ${slot}
            </ion-input>
          </div>
        `,
        config
      );
    };

    (
      [
        ['start', startSlot],
        ['end', endSlot],
      ] as const
    ).forEach(([slotName, slot]) => {
      test(`should not have visual regressions with a start-positioned label and a wide ${slotName} slot`, async ({
        page,
      }) => {
        await setContent(page, 'label-placement="start"', slot);

        const container = page.locator('.container');
        await expect(container).toHaveScreenshot(screenshot(`input-slot-overflow-label-start-${slotName}-slot`));
      });

      test(`should not have visual regressions with a floating label and a wide ${slotName} slot`, async ({ page }) => {
        await setContent(page, 'label-placement="floating"', slot);

        const container = page.locator('.container');
        await expect(container).toHaveScreenshot(screenshot(`input-slot-overflow-label-floating-${slotName}-slot`));
      });

      /**
       * Once the label floats it moves into the notch, where it is sized
       * against the wrapper instead of the space left by the slots.
       */
      test(`should not have visual regressions with a raised floating label and a wide ${slotName} slot`, async ({
        page,
      }) => {
        await setContent(page, 'label-placement="floating" value="100"', slot);

        const container = page.locator('.container');
        await expect(container).toHaveScreenshot(
          screenshot(`input-slot-overflow-label-floating-value-${slotName}-slot`)
        );
      });
    });
  });
});

/**
 * The outline fill is only supported by `md` mode.
 */
configs({ modes: ['md'] }).forEach(({ title, config }) => {
  test.describe(title('input: slot: start container adjustment'), () => {
    /**
     * The label is shifted back over the outline notch by the start
     * container width, so the offset is negative in LTR and positive in RTL.
     */
    const sign = config.direction === 'rtl' ? '' : '-';

    /**
     * Returns the value of the --internal-start-container-adjustment
     * CSS property as a CSS length string (e.g. `-48px`).
     */
    const getCssAdjustmentValue = (input: Locator) =>
      input.evaluate((el: HTMLIonInputElement) =>
        window.getComputedStyle(el).getPropertyValue('--internal-start-container-adjustment')
      );

    /**
     * Gets the width of the `.input-start` container, mirroring the
     * rounding the controller applies so that fractional widths do
     * not produce a mismatch.
     */
    const getStartWidth = (input: Locator) =>
      input
        .locator('.input-start')
        .evaluate((el: HTMLElement) => Math.round(el.getBoundingClientRect().width * 10) / 10);

    test('should match the measured start container width', async ({ page }) => {
      await page.setContent(
        `
          <ion-input label-placement="floating" fill="outline" label="Weight">
            <div slot="start" style="width: 32px; height: 40px;"></div>
          </ion-input>
        `,
        config
      );

      const input = page.locator('ion-input');
      const startWidth = await getStartWidth(input);

      /**
       * The stylesheet declares the property as 0px, so a zero-width container
       * could cause the CSS assertion below to pass even if the measurement
       * never ran.
       */
      expect(startWidth).toBeGreaterThan(0);

      await expect.poll(() => getCssAdjustmentValue(input)).toBe(`${sign}${startWidth}px`);
    });

    test('should measure when the fill resolves after the component connects', async ({ page }) => {
      await page.setContent(
        `
          <ion-input label-placement="floating" label="Weight">
            <div slot="start" style="width: 32px; height: 40px;"></div>
          </ion-input>
        `,
        config
      );

      const input = page.locator('ion-input');

      await input.evaluate((el: HTMLIonInputElement) => {
        el.fill = 'outline';
      });

      const startWidth = await getStartWidth(input);
      expect(startWidth).toBeGreaterThan(0);

      await expect.poll(() => getCssAdjustmentValue(input)).toBe(`${sign}${startWidth}px`);
    });

    test('should observe the start slot when the fill resolves after the component connects', async ({ page }) => {
      await page.setContent(
        `
          <ion-input label-placement="floating" label="Weight">
            <div id="start-slot" slot="start" style="width: 32px; height: 40px;"></div>
          </ion-input>
        `,
        config
      );

      const input = page.locator('ion-input');

      await input.evaluate((el: HTMLIonInputElement) => {
        el.fill = 'outline';
      });

      const initialWidth = await getStartWidth(input);
      await expect.poll(() => getCssAdjustmentValue(input)).toBe(`${sign}${initialWidth}px`);

      await page.evaluate(() => {
        const slot = document.getElementById('start-slot')!;
        slot.style.width = '64px';
      });

      const updatedWidth = await getStartWidth(input);
      expect(updatedWidth).toBe(initialWidth + 32);

      await expect.poll(() => getCssAdjustmentValue(input)).toBe(`${sign}${updatedWidth}px`);
    });

    test('should clear the adjustment when the fill stops being outline', async ({ page }) => {
      await page.setContent(
        `
          <ion-input label-placement="floating" fill="outline" label="Weight">
            <div slot="start" style="width: 32px; height: 40px;"></div>
          </ion-input>
        `,
        config
      );

      const input = page.locator('ion-input');
      const startWidth = await getStartWidth(input);

      await expect.poll(() => getCssAdjustmentValue(input)).toBe(`${sign}${startWidth}px`);

      await input.evaluate((el: HTMLIonInputElement) => {
        el.fill = 'solid';
      });

      await expect.poll(() => getCssAdjustmentValue(input)).toBe('');
    });

    test('should update when the start slot width changes', async ({ page }) => {
      await page.setContent(
        `
          <ion-input label-placement="floating" fill="outline" label="Weight">
            <div id="start-slot" slot="start" style="width: 32px; height: 40px;"></div>
          </ion-input>
        `,
        config
      );

      const input = page.locator('ion-input');
      const initialWidth = await getStartWidth(input);

      await expect.poll(() => getCssAdjustmentValue(input)).toBe(`${sign}${initialWidth}px`);

      // Change the width of the start slot
      await page.evaluate(() => {
        const slot = document.getElementById('start-slot')!;
        slot.style.width = '64px';
      });

      const updatedWidth = await getStartWidth(input);
      expect(updatedWidth).toBe(initialWidth + 32);

      await expect.poll(() => getCssAdjustmentValue(input)).toBe(`${sign}${updatedWidth}px`);
    });

    test('should update when a start slot is added dynamically', async ({ page }) => {
      await page.setContent(
        `
          <ion-input label-placement="floating" fill="outline" value="100" label="Weight"></ion-input>
        `,
        config
      );

      const input = page.locator('ion-input');

      // Nothing is slotted yet, so there is no width to offset the label by
      await expect.poll(() => getCssAdjustmentValue(input)).toBe('0px');

      // Dynamically add a start slot with content
      await page.evaluate(() => {
        const inputEl = document.querySelector('ion-input')!;
        const startSlot = document.createElement('div');
        startSlot.setAttribute('slot', 'start');
        startSlot.style.width = '32px';
        startSlot.style.height = '40px';
        inputEl.appendChild(startSlot);
      });

      /**
       * Wait for the skip-label-transition class to be removed to verify
       * the label animation is no longer disabled.
       */
      await page.waitForFunction(
        () => {
          const el = document.querySelector('ion-input');
          return !el?.classList.contains('skip-label-transition');
        },
        { timeout: 2000 }
      );

      const startWidth = await getStartWidth(input);

      /**
       * The stylesheet declares the property as 0px, so a zero-width container
       * could cause the CSS assertion below to pass even if the measurement
       * never ran.
       */
      expect(startWidth).toBeGreaterThan(0);

      await expect.poll(() => getCssAdjustmentValue(input)).toBe(`${sign}${startWidth}px`);
    });
  });
});

/**
 * Functional checks do not vary by mode or direction.
 */
configs({ modes: ['md'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('input: slot: label floating'), () => {
    test.describe('label-placement: floating', () => {
      test('should not raise floating label when unfocused with no value and no slots', async ({ page }) => {
        await page.setContent(
          `
            <ion-input label-placement="floating" label="Weight"></ion-input>
          `,
          config
        );

        const input = page.locator('ion-input');
        await expect(input).not.toHaveClass(/label-floating/);
      });

      test('should not raise floating label when unfocused with no value and only a start slot', async ({ page }) => {
        await page.setContent(
          `
            <ion-input label-placement="floating" label="Weight">
              <ion-icon slot="start" name="barbell" aria-hidden="true"></ion-icon>
            </ion-input>
          `,
          config
        );

        const input = page.locator('ion-input');
        await expect(input).not.toHaveClass(/label-floating/);
      });

      test('should not raise floating label when unfocused with no value and only an end slot', async ({ page }) => {
        await page.setContent(
          `
            <ion-input label-placement="floating" label="Weight">
              <ion-icon slot="end" name="lock-closed" aria-hidden="true"></ion-icon>
            </ion-input>
          `,
          config
        );

        const input = page.locator('ion-input');
        await expect(input).not.toHaveClass(/label-floating/);
      });

      test('should raise floating label when value is present', async ({ page }) => {
        await page.setContent(
          `
            <ion-input label-placement="floating" value="100" label="Weight"></ion-input>
          `,
          config
        );

        const input = page.locator('ion-input');
        await expect(input).toHaveClass(/label-floating/);
      });

      test('should raise floating label when value and start slot are present', async ({ page }) => {
        await page.setContent(
          `
            <ion-input label-placement="floating" value="100" label="Weight">
              <ion-icon slot="start" name="barbell" aria-hidden="true"></ion-icon>
            </ion-input>
          `,
          config
        );

        const input = page.locator('ion-input');
        await expect(input).toHaveClass(/label-floating/);
      });

      test('should raise floating label when value and end slot are present', async ({ page }) => {
        await page.setContent(
          `
            <ion-input label-placement="floating" value="100" label="Weight">
              <ion-icon slot="end" name="lock-closed" aria-hidden="true"></ion-icon>
            </ion-input>
          `,
          config
        );

        const input = page.locator('ion-input');
        await expect(input).toHaveClass(/label-floating/);
      });

      test('should raise floating label when focused with no value', async ({ page }) => {
        await page.setContent(
          `
            <ion-input label-placement="floating" label="Weight">
              <ion-icon slot="start" name="barbell" aria-hidden="true"></ion-icon>
            </ion-input>
          `,
          config
        );

        const input = page.locator('ion-input');
        const nativeInput = page.locator('input');

        // Label should not float by default
        await expect(input).not.toHaveClass(/label-floating/);

        // Focus the input and check that label is now floating
        await nativeInput.focus();
        await expect(input).toHaveClass(/label-floating/);
      });
    });

    test.describe('label-placement: stacked', () => {
      test('should always have floating label regardless of value or focus', async ({ page }) => {
        await page.setContent(
          `
            <ion-input label-placement="stacked" label="Weight"></ion-input>
          `,
          config
        );

        const input = page.locator('ion-input');
        const nativeInput = page.locator('input');

        // Stacked label should always float, even when empty and unfocused
        await expect(input).toHaveClass(/label-floating/);

        // Focus shouldn't change it (still floats)
        await nativeInput.focus();
        await expect(input).toHaveClass(/label-floating/);

        // Blur shouldn't change it (still floats)
        await nativeInput.blur();
        await expect(input).toHaveClass(/label-floating/);
      });

      test('should always have floating label with start slot', async ({ page }) => {
        await page.setContent(
          `
            <ion-input label-placement="stacked" label="Weight">
              <ion-icon slot="start" name="barbell" aria-hidden="true"></ion-icon>
            </ion-input>
          `,
          config
        );

        const input = page.locator('ion-input');
        await expect(input).toHaveClass(/label-floating/);
      });

      test('should always have floating label with end slot', async ({ page }) => {
        await page.setContent(
          `
            <ion-input label-placement="stacked" label="Weight">
              <ion-icon slot="end" name="lock-closed" aria-hidden="true"></ion-icon>
            </ion-input>
          `,
          config
        );

        const input = page.locator('ion-input');
        await expect(input).toHaveClass(/label-floating/);
      });
    });
  });
});
