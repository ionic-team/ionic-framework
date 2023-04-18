import { expect } from '@playwright/test';
import { test, configs } from '@utils/test/playwright';

test.describe('accordion: basic', () => {
  configs().forEach(({ config, screenshot, title }) => {
    test(title('should not have visual regressions'), async ({ page }) => {
      await page.goto(`/src/components/accordion/test/basic`, config);

      await page.setIonViewport();

      await expect(page).toHaveScreenshot(screenshot('accordion-basic'));
    });
  });
});

test.describe('accordion: ionChange', () => {
  configs({ direction: ['ltr'] }).forEach(({ config, title }) => {
    test(title('should fire ionChange when interacting with accordions'), async ({ page }) => {
      await page.setContent(
        `
        <ion-accordion-group value="second">
          <ion-accordion value="first">
            <button slot="header">Header</button>
            <div slot="content">First Content</div>
          </ion-accordion>
          <ion-accordion value="second">
            <button slot="header">Header</button>
            <div slot="content">Second Content</div>
          </ion-accordion>
          <ion-accordion value="third">
            <button slot="header">Header</button>
            <div slot="content">Third Content</div>
          </ion-accordion>
        </ion-accordion-group>
      `,
        config
      );

      const ionChange = await page.spyOnEvent('ionChange');
      const accordionHeaders = page.locator('button[slot="header"]');

      await accordionHeaders.nth(0).click();
      await expect(ionChange).toHaveReceivedEventDetail({ value: 'first' });

      await accordionHeaders.nth(1).click();
      await expect(ionChange).toHaveReceivedEventDetail({ value: 'second' });

      await accordionHeaders.nth(2).click();
      await expect(ionChange).toHaveReceivedEventDetail({ value: 'third' });
    });

    test(title('should not fire when programmatically setting a valid value'), async ({ page }) => {
      await page.setContent(
        `
        <ion-accordion-group>
          <ion-accordion value="first">
            <button slot="header">Header</button>
            <div slot="content">First Content</div>
          </ion-accordion>
          <ion-accordion value="second">
            <button slot="header">Header</button>
            <div slot="content">Second Content</div>
          </ion-accordion>
          <ion-accordion value="third">
            <button slot="header">Header</button>
            <div slot="content">Third Content</div>
          </ion-accordion>
        </ion-accordion-group>
      `,
        config
      );

      const ionChange = await page.spyOnEvent('ionChange');
      const accordionGroup = page.locator('ion-accordion-group');

      await accordionGroup.evaluate((el: HTMLIonAccordionGroupElement) => (el.value = 'second'));
      await expect(ionChange).not.toHaveReceivedEvent();
    });
  });
});
