import { expect } from '@playwright/test';
import { test, configs } from '@utils/test/playwright';

test.describe('accordion: states', () => {
  configs({ mode: ['md'] }).forEach(({ title, config }) => {
    test(title('should properly set readonly on child accordions'), async ({ page }) => {
      await page.setContent(`
        <ion-accordion-group animated="false">
          <ion-accordion>
            <ion-item slot="header">Label</ion-item>
            <div slot="content">Content</div>
          </ion-accordion>
        </ion-accordion-group>
      `);

      const accordionGroup = page.locator('ion-accordion-group');
      const accordion = page.locator('ion-accordion');

      await expect(accordion).toHaveJSProperty('readonly', false);

      await accordionGroup.evaluate((el: HTMLIonAccordionGroupElement) => {
        el.readonly = true;
      });

      await page.waitForChanges();

      await expect(accordion).toHaveJSProperty('readonly', true);
    });

    test(title('should properly set disabled on child accordions'), async ({ page }) => {
      await page.setContent(`
        <ion-accordion-group animated="false">
          <ion-accordion>
            <ion-item slot="header">Label</ion-item>
            <div slot="content">Content</div>
          </ion-accordion>
        </ion-accordion-group>
      `);

      const accordionGroup = page.locator('ion-accordion-group');
      const accordion = page.locator('ion-accordion');

      await expect(accordion).toHaveJSProperty('disabled', false);

      await accordionGroup.evaluate((el: HTMLIonAccordionGroupElement) => {
        el.disabled = true;
      });

      await page.waitForChanges();

      await expect(accordion).toHaveJSProperty('disabled', true);
    });
  });
});
