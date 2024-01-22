import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs({ modes: ['md'], directions: ['ltr'] }).forEach(({ config, title }) => {
  test.describe(title('accordion: disabled'), () => {
    test('should properly set disabled on child accordions', async ({ page }) => {
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

      const accordionGroup = page.locator('ion-accordion-group');
      const accordion = page.locator('ion-accordion');

      await expect(accordion).toHaveJSProperty('disabled', false);

      await accordionGroup.evaluate((el: HTMLIonAccordionGroupElement) => {
        el.disabled = true;
      });

      await page.waitForChanges();

      await expect(accordion).toHaveJSProperty('disabled', true);
    });

    test('should not open accordion on click when group is disabled', async ({ page }) => {
      await page.setContent(
        `
      <ion-accordion-group animated="false" disabled>
        <ion-accordion>
          <ion-item slot="header">Label</ion-item>
          <div slot="content">Content</div>
        </ion-accordion>
      </ion-accordion-group>
    `,
        config
      );

      const accordion = page.locator('ion-accordion');

      await expect(accordion).toHaveClass(/accordion-collapsed/);

      accordion.click();
      await page.waitForChanges();

      await expect(accordion).toHaveClass(/accordion-collapsed/);
    });

    test('should not open accordion on click when accordion is disabled', async ({ page }) => {
      await page.setContent(
        `
      <ion-accordion-group animated="false">
        <ion-accordion disabled>
          <ion-item slot="header">Label</ion-item>
          <div slot="content">Content</div>
        </ion-accordion>
      </ion-accordion-group>
    `,
        config
      );

      const accordion = page.locator('ion-accordion');

      await expect(accordion).toHaveClass(/accordion-collapsed/);

      accordion.click();
      await page.waitForChanges();

      await expect(accordion).toHaveClass(/accordion-collapsed/);
    });

    test('should not open accordion via keyboard navigation when group is disabled', async ({ page, browserName }) => {
      await page.setContent(
        `
      <ion-accordion-group animated="false" disabled>
        <ion-accordion>
          <ion-item slot="header">Label</ion-item>
          <div slot="content">Content</div>
        </ion-accordion>
      </ion-accordion-group>
    `,
        config
      );

      const accordion = page.locator('ion-accordion');
      const tabKey = browserName === 'webkit' ? 'Alt+Tab' : 'Tab';

      await expect(accordion).toHaveClass(/accordion-collapsed/);

      await page.keyboard.press(tabKey);
      await page.waitForChanges();

      await page.keyboard.press('Enter');
      await page.waitForChanges();

      await expect(accordion).toHaveClass(/accordion-collapsed/);
    });

    test('should not open accordion via keyboard navigation when accordion is disabled', async ({
      page,
      browserName,
    }) => {
      await page.setContent(
        `
      <ion-accordion-group animated="false">
        <ion-accordion disabled>
          <ion-item slot="header">Label</ion-item>
          <div slot="content">Content</div>
        </ion-accordion>
      </ion-accordion-group>
    `,
        config
      );

      const accordion = page.locator('ion-accordion');
      const tabKey = browserName === 'webkit' ? 'Alt+Tab' : 'Tab';

      await expect(accordion).toHaveClass(/accordion-collapsed/);

      await page.keyboard.press(tabKey);
      await page.waitForChanges();

      await page.keyboard.press('Enter');
      await page.waitForChanges();

      await expect(accordion).toHaveClass(/accordion-collapsed/);
    });
  });
});
