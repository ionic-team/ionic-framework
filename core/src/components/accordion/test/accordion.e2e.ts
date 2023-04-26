import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs({ modes: ['md'], directions: ['ltr'] }).forEach(({ config, title }) => {
  test.describe(title('accordion: states'), () => {
    test.beforeEach(async ({ page }) => {
      await page.setContent(
        `
      <ion-accordion-group animated="false">
        <ion-accordion>
          <ion-item slot="header">Label</ion-item>
          <div slot="content">Content</div>
        </ion-accordion>
      </ion-accordion-group>
    `,
        config
      );
    });
    test('should properly set readonly on child accordions', async ({ page }) => {
      const accordionGroup = page.locator('ion-accordion-group');
      const accordion = page.locator('ion-accordion');

      await expect(accordion).toHaveJSProperty('readonly', false);

      await accordionGroup.evaluate((el: HTMLIonAccordionGroupElement) => {
        el.readonly = true;
      });

      await page.waitForChanges();

      await expect(accordion).toHaveJSProperty('readonly', true);
    });

    test('should properly set disabled on child accordions', async ({ page }) => {
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
