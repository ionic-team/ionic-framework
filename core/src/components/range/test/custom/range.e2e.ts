import { expect } from '@playwright/test';
import { configs, dragElementBy, test } from '@utils/test/playwright';

/**
 * This behavior does not vary across modes/directions
 */
configs({ directions: ['ltr'], modes: ['md'] }).forEach(({ title, config }) => {
  test.describe(title('range: custom'), () => {
    test.describe(title('CSS shadow parts'), () => {
      test('should be able to customize bar parts', async ({ page }) => {
        await page.setContent(
          `
          <style>
            ion-range::part(bar) {
              background-color: red;
            }
            ion-range::part(bar-active) {
              background-color: green;
            }
          </style>

          <ion-range label="Label" value="50"></ion-range>
        `,
          config
        );

        const range = page.locator('ion-range');

        const barBackgroundColor = await range.evaluate((el) => {
          const shadowRoot = el.shadowRoot;
          const bar = shadowRoot?.querySelector('.range-bar');
          return bar ? window.getComputedStyle(bar).backgroundColor : '';
        });
        expect(barBackgroundColor).toBe('rgb(255, 0, 0)');

        const activeBarBackgroundColor = await range.evaluate((el) => {
          const shadowRoot = el.shadowRoot;
          const activeBar = shadowRoot?.querySelector('.range-bar-active');
          return activeBar ? window.getComputedStyle(activeBar).backgroundColor : '';
        });
        expect(activeBarBackgroundColor).toBe('rgb(0, 128, 0)');
      });

      test('should be able to customize pin parts', async ({ page }) => {
        await page.setContent(
          `
          <style>
            ion-range::part(pin) {
              background-color: red;
            }
            ion-range::part(pin)::before {
              background-color: green;
            }
          </style>

          <ion-range label="Label" value="50" pin="true"></ion-range>
        `,
          config
        );

        const range = page.locator('ion-range');

        const pinBackgroundColor = await range.evaluate((el) => {
          const shadowRoot = el.shadowRoot;
          const pin = shadowRoot?.querySelector('.range-pin');
          return pin ? window.getComputedStyle(pin).backgroundColor : '';
        });
        expect(pinBackgroundColor).toBe('rgb(255, 0, 0)');

        const pinBeforeBackgroundColor = await range.evaluate((el) => {
          const shadowRoot = el.shadowRoot;
          const pin = shadowRoot?.querySelector('.range-pin');
          if (!pin) return '';
          return window.getComputedStyle(pin, '::before').backgroundColor;
        });
        expect(pinBeforeBackgroundColor).toBe('rgb(0, 128, 0)');
      });

      test('should be able to customize tick parts', async ({ page }) => {
        await page.setContent(
          `
          <style>
            ion-range::part(tick) {
              background-color: red;
            }
            ion-range::part(tick-active) {
              background-color: green;
            }
          </style>

          <ion-range label="Label" value="50" snaps="true" ticks="true"></ion-range>
        `,
          config
        );

        const range = page.locator('ion-range');

        const tickBackgroundColor = await range.evaluate((el) => {
          const shadowRoot = el.shadowRoot;
          const tick = shadowRoot?.querySelector('.range-tick:not(.range-tick-active)');
          return tick ? window.getComputedStyle(tick).backgroundColor : '';
        });
        expect(tickBackgroundColor).toBe('rgb(255, 0, 0)');

        const activeTickBackgroundColor = await range.evaluate((el) => {
          const shadowRoot = el.shadowRoot;
          const activeTick = shadowRoot?.querySelector('.range-tick-active');
          return activeTick ? window.getComputedStyle(activeTick).backgroundColor : '';
        });
        expect(activeTickBackgroundColor).toBe('rgb(0, 128, 0)');
      });

      test('should be able to customize knob parts', async ({ page }) => {
        await page.setContent(
          `
          <style>
            ion-range::part(knob-handle) {
              background-color: red;
            }
            ion-range::part(knob) {
              background-color: green;
            }
          </style>

          <ion-range label="Label" value="50"></ion-range>
        `,
          config
        );

        const range = page.locator('ion-range');

        const knobHandleBackgroundColor = await range.evaluate((el) => {
          const shadowRoot = el.shadowRoot;
          const knobHandle = shadowRoot?.querySelector('.range-knob-handle');
          return knobHandle ? window.getComputedStyle(knobHandle).backgroundColor : '';
        });
        expect(knobHandleBackgroundColor).toBe('rgb(255, 0, 0)');

        const knobBackgroundColor = await range.evaluate((el) => {
          const shadowRoot = el.shadowRoot;
          const knob = shadowRoot?.querySelector('.range-knob');
          return knob ? window.getComputedStyle(knob).backgroundColor : '';
        });
        expect(knobBackgroundColor).toBe('rgb(0, 128, 0)');
      });

      test('should be able to customize dual knob a & b parts', async ({ page }) => {
        await page.setContent(
          `
          <style>
            ion-range::part(knob-handle-a) {
              background-color: red;
            }
            ion-range::part(knob-handle-b) {
              background-color: green;
            }
            ion-range::part(knob-a) {
              background-color: blue;
            }
            ion-range::part(knob-b) {
              background-color: yellow;
            }
            ion-range::part(pin-a) {
              background-color: orange;
            }
            ion-range::part(pin-b) {
              background-color: purple;
            }
          </style>

          <ion-range label="Label" dual-knobs="true" pin="true"></ion-range>
        `,
          config
        );

        const range = page.locator('ion-range');
        await range.evaluate((el) => {
          (el as any).value = {
            lower: 25,
            upper: 75,
          };
        });
        await page.waitForChanges();

        const knobHandleABackgroundColor = await range.evaluate((el) => {
          const shadowRoot = el.shadowRoot;
          const knobHandleA = shadowRoot?.querySelector('.range-knob-handle-a');
          return knobHandleA ? window.getComputedStyle(knobHandleA).backgroundColor : '';
        });
        expect(knobHandleABackgroundColor).toBe('rgb(255, 0, 0)');

        const knobHandleBBackgroundColor = await range.evaluate((el) => {
          const shadowRoot = el.shadowRoot;
          const knobHandleB = shadowRoot?.querySelector('.range-knob-handle-b');
          return knobHandleB ? window.getComputedStyle(knobHandleB).backgroundColor : '';
        });
        expect(knobHandleBBackgroundColor).toBe('rgb(0, 128, 0)');

        // We query for the knob inside knob-handle-a because the knob
        // does not get a class for the knob name, only a part.
        const knobABackgroundColor = await range.evaluate((el) => {
          const shadowRoot = el.shadowRoot;
          const knobA = shadowRoot?.querySelector('.range-knob-handle-a .range-knob');
          return knobA ? window.getComputedStyle(knobA).backgroundColor : '';
        });
        expect(knobABackgroundColor).toBe('rgb(0, 0, 255)');

        // We query for the knob inside knob-handle-b because the knob
        // does not get a class for the knob name, only a part.
        const knobBBackgroundColor = await range.evaluate((el) => {
          const shadowRoot = el.shadowRoot;
          const knobB = shadowRoot?.querySelector('.range-knob-handle-b .range-knob');
          return knobB ? window.getComputedStyle(knobB).backgroundColor : '';
        });
        expect(knobBBackgroundColor).toBe('rgb(255, 255, 0)');

        // We query for the pin inside knob-handle-a because the pin
        // does not get a class for the knob name, only a part.
        const pinABackgroundColor = await range.evaluate((el) => {
          const shadowRoot = el.shadowRoot;
          const pinA = shadowRoot?.querySelector('.range-knob-handle-a .range-pin');
          return pinA ? window.getComputedStyle(pinA).backgroundColor : '';
        });
        expect(pinABackgroundColor).toBe('rgb(255, 165, 0)');

        // We query for the pin inside knob-handle-b because the pin
        // does not get a class for the knob name, only a part.
        const pinBBackgroundColor = await range.evaluate((el) => {
          const shadowRoot = el.shadowRoot;
          const pinB = shadowRoot?.querySelector('.range-knob-handle-b .range-pin');
          return pinB ? window.getComputedStyle(pinB).backgroundColor : '';
        });
        expect(pinBBackgroundColor).toBe('rgb(128, 0, 128)');
      });

      test('should be able to customize dual knob lower & upper parts', async ({ page }) => {
        await page.setContent(
          `
          <style>
            ion-range::part(knob-handle-lower) {
              background-color: red;
            }
            ion-range::part(knob-handle-upper) {
              background-color: green;
            }
            ion-range::part(knob-lower) {
              background-color: blue;
            }
            ion-range::part(knob-upper) {
              background-color: yellow;
            }
            ion-range::part(pin-lower) {
              background-color: orange;
            }
            ion-range::part(pin-upper) {
              background-color: purple;
            }
          </style>

          <ion-range label="Label" dual-knobs="true" pin="true"></ion-range>
        `,
          config
        );

        const range = page.locator('ion-range');
        await range.evaluate((el) => {
          (el as any).value = {
            lower: 25,
            upper: 75,
          };
        });
        await page.waitForChanges();

        // Lower & upper are added as shadow parts but not CSS classes, so we
        // have to query by their shadow parts.
        const knobHandleLowerBackgroundColor = await range.evaluate((el) => {
          const shadowRoot = el.shadowRoot;
          const knobHandleLower = shadowRoot?.querySelector('[part~="knob-handle-lower"]');
          return knobHandleLower ? window.getComputedStyle(knobHandleLower).backgroundColor : '';
        });
        expect(knobHandleLowerBackgroundColor).toBe('rgb(255, 0, 0)');

        const knobHandleUpperBackgroundColor = await range.evaluate((el) => {
          const shadowRoot = el.shadowRoot;
          const knobHandleUpper = shadowRoot?.querySelector('[part~="knob-handle-upper"]');
          return knobHandleUpper ? window.getComputedStyle(knobHandleUpper).backgroundColor : '';
        });
        expect(knobHandleUpperBackgroundColor).toBe('rgb(0, 128, 0)');

        const knobLowerBackgroundColor = await range.evaluate((el) => {
          const knobLower = el.shadowRoot?.querySelector('[part~="knob-lower"]');
          return knobLower ? window.getComputedStyle(knobLower).backgroundColor : '';
        });
        expect(knobLowerBackgroundColor).toBe('rgb(0, 0, 255)');

        const knobUpperBackgroundColor = await range.evaluate((el) => {
          const knobUpper = el.shadowRoot?.querySelector('[part~="knob-upper"]');
          return knobUpper ? window.getComputedStyle(knobUpper).backgroundColor : '';
        });
        expect(knobUpperBackgroundColor).toBe('rgb(255, 255, 0)');

        const pinLowerBackgroundColor = await range.evaluate((el) => {
          const pinLower = el.shadowRoot?.querySelector('[part~="pin-lower"]');
          return pinLower ? window.getComputedStyle(pinLower).backgroundColor : '';
        });
        expect(pinLowerBackgroundColor).toBe('rgb(255, 165, 0)');

        const pinUpperBackgroundColor = await range.evaluate((el) => {
          const pinUpper = el.shadowRoot?.querySelector('[part~="pin-upper"]');
          return pinUpper ? window.getComputedStyle(pinUpper).backgroundColor : '';
        });
        expect(pinUpperBackgroundColor).toBe('rgb(128, 0, 128)');
      });

      test('should keep a & b parts on same elements and swap lower & upper parts when values swap', async ({
        page,
      }) => {
        await page.setContent(
          `
          <ion-range label="Label" dual-knobs="true" pin="true"></ion-range>
        `,
          config
        );

        const range = page.locator('ion-range');
        await range.evaluate((el) => {
          (el as any).value = { lower: 25, upper: 75 };
        });
        await page.waitForChanges();

        // On load: query each a & b part to check lower & upper
        const handleAHasLowerOnLoad = await range.evaluate((el) => {
          const handleA = el.shadowRoot?.querySelector('[part~="knob-handle-a"]');
          const part = handleA?.getAttribute('part') ?? '';
          return part.includes('knob-handle-lower');
        });
        const handleAHasUpperOnLoad = await range.evaluate((el) => {
          const handleA = el.shadowRoot?.querySelector('[part~="knob-handle-a"]');
          const part = handleA?.getAttribute('part') ?? '';
          return part.includes('knob-handle-upper');
        });
        const handleBHasLowerOnLoad = await range.evaluate((el) => {
          const handleB = el.shadowRoot?.querySelector('[part~="knob-handle-b"]');
          const part = handleB?.getAttribute('part') ?? '';
          return part.includes('knob-handle-lower');
        });
        const handleBHasUpperOnLoad = await range.evaluate((el) => {
          const handleB = el.shadowRoot?.querySelector('[part~="knob-handle-b"]');
          const part = handleB?.getAttribute('part') ?? '';
          return part.includes('knob-handle-upper');
        });

        // The lower knob is assigned to the a part and the
        // upper knob is assigned to the b part on load
        expect(handleAHasLowerOnLoad).toBe(true);
        expect(handleAHasUpperOnLoad).toBe(false);
        expect(handleBHasLowerOnLoad).toBe(false);
        expect(handleBHasUpperOnLoad).toBe(true);

        // Drag the lower knob right so the two knobs swap positions
        const box = await range.boundingBox();
        expect(box).not.toBeNull();
        const startX = box!.x + box!.width * 0.25;
        const startY = box!.y + box!.height / 2;
        const dragDistance = Math.round(box!.width * 0.55);
        await dragElementBy(range, page, dragDistance, 0, startX, startY);
        await page.waitForChanges();

        // After swap: the same elements have parts A and B
        // but lower and upper have swapped positions
        const handleAHasLowerAfterSwap = await range.evaluate((el) => {
          const handleA = el.shadowRoot?.querySelector('[part~="knob-handle-a"]');
          const part = handleA?.getAttribute('part') ?? '';
          return part.includes('knob-handle-lower');
        });
        const handleAHasUpperAfterSwap = await range.evaluate((el) => {
          const handleA = el.shadowRoot?.querySelector('[part~="knob-handle-a"]');
          const part = handleA?.getAttribute('part') ?? '';
          return part.includes('knob-handle-upper');
        });
        const handleBHasLowerAfterSwap = await range.evaluate((el) => {
          const handleB = el.shadowRoot?.querySelector('[part~="knob-handle-b"]');
          const part = handleB?.getAttribute('part') ?? '';
          return part.includes('knob-handle-lower');
        });
        const handleBHasUpperAfterSwap = await range.evaluate((el) => {
          const handleB = el.shadowRoot?.querySelector('[part~="knob-handle-b"]');
          const part = handleB?.getAttribute('part') ?? '';
          return part.includes('knob-handle-upper');
        });

        // After swap: the lower knob is assigned to the b part and the
        // upper knob is assigned to the a part
        expect(handleAHasLowerAfterSwap).toBe(false);
        expect(handleAHasUpperAfterSwap).toBe(true);
        expect(handleBHasLowerAfterSwap).toBe(true);
        expect(handleBHasUpperAfterSwap).toBe(false);
      });
    });
  });
});
