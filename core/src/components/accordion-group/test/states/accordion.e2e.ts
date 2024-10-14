import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs({ directions: ['ltr'], modes: ['ionic-md'] }).forEach(({ config, screenshot, title }) => {
  test.describe(title('accordion-group: states'), () => {
    test('should render disabled state', async ({ page }) => {
      await page.setContent(
        `
        <ion-accordion-group value="first" disabled="true">
          <ion-accordion value="first">
            <ion-item slot="header">
              <ion-label>Accordion title</ion-label>
            </ion-item>
            <div slot="content">This is the body of the accordion.</div>
          </ion-accordion>
          <ion-accordion value="second">
            <ion-item slot="header">
              <ion-label>Accordion title</ion-label>
            </ion-item>
            <div slot="content">This is the body of the accordion.</div>
          </ion-accordion>
          <ion-accordion value="third">
            <ion-item slot="header">
              <ion-label>Accordion title</ion-label>
            </ion-item>
            <div slot="content">This is the body of the accordion.</div>
          </ion-accordion>
        </ion-accordion-group>
    `,
        config
      );

      const accordionGroup = page.locator('ion-accordion-group');

      await expect(accordionGroup).toHaveScreenshot(screenshot('accordion-group-disabled'));
    });
  });
});
