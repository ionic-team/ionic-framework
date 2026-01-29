import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

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
    });

    test('should be able to customize dual knob parts', async ({ page }) => {
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

      const knobABackgroundColor = await range.evaluate((el) => {
        const shadowRoot = el.shadowRoot;
        const knobA = shadowRoot?.querySelector('.range-knob-a');
        return knobA ? window.getComputedStyle(knobA).backgroundColor : '';
      });
      expect(knobABackgroundColor).toBe('rgb(0, 0, 255)');

      const knobBBackgroundColor = await range.evaluate((el) => {
        const shadowRoot = el.shadowRoot;
        const knobB = shadowRoot?.querySelector('.range-knob-b');
        return knobB ? window.getComputedStyle(knobB).backgroundColor : '';
      });
      expect(knobBBackgroundColor).toBe('rgb(255, 255, 0)');

      const pinABackgroundColor = await range.evaluate((el) => {
        const shadowRoot = el.shadowRoot;
        const pinA = shadowRoot?.querySelector('.range-knob-handle-a .range-pin');
        return pinA ? window.getComputedStyle(pinA).backgroundColor : '';
      });
      expect(pinABackgroundColor).toBe('rgb(255, 165, 0)');

      const pinBBackgroundColor = await range.evaluate((el) => {
        const shadowRoot = el.shadowRoot;
        const pinB = shadowRoot?.querySelector('.range-knob-handle-b .range-pin');
        return pinB ? window.getComputedStyle(pinB).backgroundColor : '';
      });
      expect(pinBBackgroundColor).toBe('rgb(128, 0, 128)');
    });
  });
});
