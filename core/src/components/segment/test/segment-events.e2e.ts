import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('segment: events: ionChange', () => {
  test.beforeEach(({ skip }) => {
    skip.rtl();
  });

  test.describe('when the segment is clicked', () => {
    test.describe('should emit', () => {
      test('when the value changes', async ({ page }) => {
        await page.setContent(`
          <ion-segment value="1">
            <ion-segment-button value="1">One</ion-segment-button>
            <ion-segment-button value="2">Two</ion-segment-button>
            <ion-segment-button value="3">Three</ion-segment-button>
          </ion-segment>
        `);

        const segment = page.locator('ion-segment');
        const ionChangeSpy = await page.spyOnEvent('ionChange');

        await page.click('ion-segment-button[value="2"]');

        await ionChangeSpy.next();

        expect(await segment.evaluate((el: HTMLIonSegmentElement) => el.value)).toBe('2');

        expect(ionChangeSpy).toHaveReceivedEventDetail({ value: '2' });
        expect(ionChangeSpy.events.length).toBe(1);
      });

      test('when the segment does not have an initial value', async ({ page }) => {
        await page.setContent(`
          <ion-segment>
            <ion-segment-button value="1">One</ion-segment-button>
            <ion-segment-button value="2">Two</ion-segment-button>
            <ion-segment-button value="3">Three</ion-segment-button>
          </ion-segment>
        `);

        const segment = page.locator('ion-segment');
        const ionChangeSpy = await page.spyOnEvent('ionChange');

        await page.click('ion-segment-button[value="2"]');

        await ionChangeSpy.next();

        expect(await segment.evaluate((el: HTMLIonSegmentElement) => el.value)).toBe('2');

        expect(ionChangeSpy).toHaveReceivedEventDetail({ value: '2' });
        expect(ionChangeSpy.events.length).toBe(1);
      });
    });
  });

  test.describe('when the pointer is released', () => {
    test.describe('should emit', () => {
      test('if the value has changed', async ({ page }) => {
        test.info().annotations.push({
          type: 'issue',
          description: 'https://github.com/ionic-team/ionic-framework/issues/20257',
        });

        await page.setContent(`
          <ion-segment value="1">
            <ion-segment-button value="1">One</ion-segment-button>
            <ion-segment-button value="2">Two</ion-segment-button>
            <ion-segment-button value="3">Three</ion-segment-button>
          </ion-segment>
        `);

        const ionChangeSpy = await page.spyOnEvent('ionChange');

        const firstButton = page.locator('ion-segment-button[value="1"]');
        const lastButton = page.locator('ion-segment-button[value="3"]');

        await firstButton.hover();
        await page.mouse.down();

        await lastButton.hover();
        await page.mouse.up();

        await ionChangeSpy.next();

        expect(ionChangeSpy).toHaveReceivedEventDetail({ value: '3' });
      });
    });
  });

  test.describe('should not emit', () => {
    test('if the value has not changed', async ({ page }) => {
      await page.setContent(`
        <ion-segment value="1">
          <ion-segment-button value="1">One</ion-segment-button>
          <ion-segment-button value="2">Two</ion-segment-button>
          <ion-segment-button value="3">Three</ion-segment-button>
        </ion-segment>
      `);

      const segment = page.locator('ion-segment');
      const ionChangeSpy = await page.spyOnEvent('ionChange');

      await page.click('ion-segment-button[value="1"]');

      expect(await segment.evaluate((el: HTMLIonSegmentElement) => el.value)).toBe('1');

      expect(ionChangeSpy.events.length).toBe(0);
    });

    test('if the value is set programmatically', async ({ page }) => {
      await page.setContent(`
        <ion-segment value="1">
          <ion-segment-button value="1">One</ion-segment-button>
          <ion-segment-button value="2">Two</ion-segment-button>
          <ion-segment-button value="3">Three</ion-segment-button>
        </ion-segment>
      `);

      const segment = page.locator('ion-segment');
      const ionChangeSpy = await page.spyOnEvent('ionChange');

      await segment.evaluate((el: HTMLIonSegmentElement) => (el.value = '2'));

      expect(ionChangeSpy.events.length).toBe(0);
      expect(await segment.evaluate((el: HTMLIonSegmentElement) => el.value)).toBe('2');
    });
  });
});
