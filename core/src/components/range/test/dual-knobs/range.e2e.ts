import type { Locator } from '@playwright/test';
import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

const DUAL_VALUE = { lower: 20, upper: 80 };

/**
 * Returns the value each knob is positioned at. Sorted low to high because knob
 * A is not guaranteed to be the knob holding the lower value.
 */
const knobValues = async (range: Locator) => {
  const values: string[] = await range
    .locator('.range-knob-handle')
    .evaluateAll((els: HTMLElement[]) => els.map((el) => el.getAttribute('aria-valuenow')!));

  return values.sort((a, b) => parseFloat(a) - parseFloat(b));
};

/**
 * This behavior does not vary across modes/directions
 */
configs({ directions: ['ltr'], modes: ['md'] }).forEach(({ title, config }) => {
  test.describe(title('range: dual knobs'), () => {
    test('should position knobs when dualKnobs is assigned before value', async ({ page }) => {
      await page.setContent(`<ion-range aria-label="range"></ion-range>`, config);

      const range = page.locator('ion-range');
      await range.evaluate((el: HTMLIonRangeElement, value) => {
        el.dualKnobs = true;
        el.value = value;
      }, DUAL_VALUE);
      await page.waitForChanges();

      expect(await knobValues(range)).toEqual(['20', '80']);

      // A single knob range ignores the lower half of an object value.
      await range.evaluate((el: HTMLIonRangeElement) => (el.dualKnobs = false));
      await page.waitForChanges();

      expect(await knobValues(range)).toEqual(['80']);
    });

    test('should position knobs when dualKnobs is assigned after value', async ({ page }, testInfo) => {
      testInfo.annotations.push({
        type: 'issue',
        description: 'https://github.com/ionic-team/ionic-framework/issues/31026',
      });

      await page.setContent(`<ion-range aria-label="range"></ion-range>`, config);

      const range = page.locator('ion-range');
      await range.evaluate((el: HTMLIonRangeElement, value) => {
        el.value = value;
        el.dualKnobs = true;
      }, DUAL_VALUE);
      await page.waitForChanges();

      expect(await knobValues(range)).toEqual(['20', '80']);
    });

    test('should reposition knobs when dualKnobs is toggled at runtime', async ({ page }) => {
      await page.setContent(`<ion-range aria-label="range"></ion-range>`, config);

      const range = page.locator('ion-range');
      await range.evaluate((el: HTMLIonRangeElement, value) => (el.value = value), DUAL_VALUE);
      await page.waitForChanges();

      // A single knob range ignores the lower half of an object value.
      expect(await knobValues(range)).toEqual(['80']);

      await range.evaluate((el: HTMLIonRangeElement) => (el.dualKnobs = true));
      await page.waitForChanges();

      expect(await knobValues(range)).toEqual(['20', '80']);

      await range.evaluate((el: HTMLIonRangeElement) => (el.dualKnobs = false));
      await page.waitForChanges();

      expect(await knobValues(range)).toEqual(['80']);
    });
  });
});
