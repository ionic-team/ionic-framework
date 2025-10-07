import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs({ directions: ['ltr'], modes: ['ionic-md'] }).forEach(({ config, screenshot, title }) => {
  test.describe(title('accordion-group: shape'), () => {
    ['round', 'soft', 'rectangular'].forEach((shape) => {
      test(`${shape} - should not have visual regressions`, async ({ page }) => {
        await page.setContent(
          `
          <style>
            /* Background styles to show the border radius */
            :root {
              --ion-background-color: #222;
            }
          </style>

          <ion-accordion-group value="first" expand="inset" shape="${shape}">
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

        await expect(accordionGroup).toHaveScreenshot(screenshot(`accordion-group-shape-${shape}`));
      });
    });
  });
});
