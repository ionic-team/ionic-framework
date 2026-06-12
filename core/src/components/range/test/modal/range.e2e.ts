import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs({ modes: ['ios'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('range: modal'), () => {
    test('should render dual knob value when presented in a modal', async ({ page }) => {
      await page.goto('/src/components/range/test/modal', config);
      const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');

      await page.click('#open-modal');
      await ionModalDidPresent.next();

      const range = page.locator('ion-modal ion-range');
      await expect(range).toBeVisible();

      const knobPositions = await range.evaluate((el: HTMLIonRangeElement) => {
        const shadowRoot = el.shadowRoot!;

        return {
          lower: (shadowRoot.querySelector('[part~="knob-handle-lower"]') as HTMLElement).style.left,
          upper: (shadowRoot.querySelector('[part~="knob-handle-upper"]') as HTMLElement).style.left,
        };
      });

      expect(knobPositions).toEqual({
        lower: '20%',
        upper: '80%',
      });
    });
  });
});
