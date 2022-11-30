import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('accordion: states', () => {
  test.beforeEach(({ skip }) => {
    skip.rtl();
    skip.mode('ios');
  });
  test('should properly set readonly on child accordions', async ({ page }) => {
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

    expect(accordion).toHaveJSProperty('readonly', false);

    await accordionGroup.evaluate((el: HTMLIonAccordionGroupElement) => {
      el.readonly = true;
    });

    await page.waitForChanges();

    expect(accordion).toHaveJSProperty('readonly', true);
  });

  test('should properly set disabled on child accordions', async ({ page }) => {
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

    expect(accordion).toHaveJSProperty('disabled', false);

    await accordionGroup.evaluate((el: HTMLIonAccordionGroupElement) => {
      el.disabled = true;
    });

    await page.waitForChanges();

    expect(accordion).toHaveJSProperty('disabled', true);
  });
});
