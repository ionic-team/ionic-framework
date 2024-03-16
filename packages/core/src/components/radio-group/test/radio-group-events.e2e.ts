import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs({ modes: ['ios'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('radio group: events: ionChange'), () => {
    test('should emit when selecting an unchecked radio', async ({ page }) => {
      await page.setContent(
        `
      <ion-radio-group value="1">
        <ion-radio value="1" aria-label="1"></ion-radio>
        <ion-radio value="2" aria-label="2"></ion-radio>
        <ion-radio value="3" aria-label="3"></ion-radio>
      </ion-radio-group>
    `,
        config
      );

      const ionChangeSpy = await page.spyOnEvent('ionChange');

      await page.click('ion-radio[value="2"]');

      await ionChangeSpy.next();

      expect(ionChangeSpy).toHaveReceivedEventTimes(1);
      expect(ionChangeSpy).toHaveReceivedEventDetail({ value: '2', event: { isTrusted: true } });
    });

    test('should emit when the radio group does not have an initial value', async ({ page }) => {
      await page.setContent(
        `
      <ion-radio-group>
        <ion-radio value="1" aria-label="1"></ion-radio>
        <ion-radio value="2" aria-label="2"></ion-radio>
        <ion-radio value="3" aria-label="3"></ion-radio>
      </ion-radio-group>
    `,
        config
      );

      const ionChangeSpy = await page.spyOnEvent('ionChange');

      await page.click('ion-radio[value="2"]');

      await ionChangeSpy.next();

      expect(ionChangeSpy).toHaveReceivedEventTimes(1);
      expect(ionChangeSpy).toHaveReceivedEventDetail({ value: '2', event: { isTrusted: true } });
    });

    test('should not emit when selecting a checked radio', async ({ page }) => {
      await page.setContent(
        `
      <ion-radio-group value="1">
        <ion-radio value="1" aria-label="1"></ion-radio>
        <ion-radio value="2" aria-label="2"></ion-radio>
        <ion-radio value="3" aria-label="3"></ion-radio>
      </ion-radio-group>
    `,
        config
      );

      const ionChangeSpy = await page.spyOnEvent('ionChange');

      await page.click('ion-radio[value="1"]');

      await page.waitForChanges();

      expect(ionChangeSpy).toHaveReceivedEventTimes(0);
    });

    test('should not emit if the value is set programmatically', async ({ page }) => {
      await page.setContent(
        `
        <ion-radio-group value="1">
          <ion-radio value="1" aria-label="1"></ion-radio>
          <ion-radio value="2" aria-label="2"></ion-radio>
          <ion-radio value="3" aria-label="3"></ion-radio>
        </ion-radio-group>
      `,
        config
      );

      const radioGroup = page.locator('ion-radio-group');
      const ionChangeSpy = await page.spyOnEvent('ionChange');

      await radioGroup.evaluate((el: HTMLIonRadioGroupElement) => (el.value = '2'));

      expect(ionChangeSpy).toHaveReceivedEventTimes(0);
      expect(await radioGroup.evaluate((el: HTMLIonRadioGroupElement) => el.value)).toBe('2');
    });

    test.describe('allowEmptySelection', () => {
      test('should emit when selecting a checked radio', async ({ page }) => {
        await page.setContent(
          `
        <ion-radio-group allow-empty-selection="true" value="1">
          <ion-radio value="1" aria-label="1"></ion-radio>
          <ion-radio value="2" aria-label="2"></ion-radio>
          <ion-radio value="3" aria-label="3"></ion-radio>
        </ion-radio-group>
      `,
          config
        );

        const ionChangeSpy = await page.spyOnEvent('ionChange');

        await page.click('ion-radio[value="1"]');

        await ionChangeSpy.next();

        expect(ionChangeSpy).toHaveReceivedEventTimes(1);
        expect(ionChangeSpy).toHaveReceivedEventDetail({ value: undefined, event: { isTrusted: true } });
      });
    });
  });
});
