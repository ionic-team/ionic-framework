import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs().forEach(({ config, screenshot, title }) => {
  test.describe(title('accordion: basic'), () => {
    test('should not have visual regressions', async ({ page }) => {
      await page.goto(`/src/components/accordion/test/basic`, config);

      await page.setIonViewport();

      await expect(page).toHaveScreenshot(screenshot('accordion-basic'));
    });
  });
});

configs({ directions: ['ltr'] }).forEach(({ config, title }) => {
  test.describe(title('accordion: ionChange'), () => {
    test.beforeEach(async ({ page }) => {
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
    });
    test('should fire ionChange when interacting with accordions', async ({ page }) => {
      const ionChange = await page.spyOnEvent('ionChange');
      const accordionHeaders = page.locator('button[slot="header"]');

      await accordionHeaders.nth(0).click();
      await expect(ionChange).toHaveReceivedEventDetail({ value: 'first' });

      await accordionHeaders.nth(1).click();
      await expect(ionChange).toHaveReceivedEventDetail({ value: 'second' });

      await accordionHeaders.nth(2).click();
      await expect(ionChange).toHaveReceivedEventDetail({ value: 'third' });
    });

    test('should not fire when programmatically setting a valid value', async ({ page }) => {
      const ionChange = await page.spyOnEvent('ionChange');
      const accordionGroup = page.locator('ion-accordion-group');

      await accordionGroup.evaluate((el: HTMLIonAccordionGroupElement) => (el.value = 'second'));
      await expect(ionChange).not.toHaveReceivedEvent();
    });
  });
});

configs({ modes: ['ionic-md'] }).forEach(({ config, screenshot, title }) => {
  test.describe(title('accordion: basic'), () => {
    test('should not have visual regressions with text content', async ({ page }) => {
      await page.setContent(
        `
        <ion-accordion-group value="first">
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

      const accordion = page.locator('ion-accordion-group');

      await expect(accordion).toHaveScreenshot(screenshot('accordion-basic-text'));
    });
  });
});

/**
 * Other ios tests draw at 1x (refer to the `deviceScaleFactor` fixture in
 * `playwright-page.ts`), so they never show a line at its real thickness.
 * This test draws at each browser's own density and keeps every pixel,
 * so a missing, thicker or misplaced line above a header fails. Only the ios
 * theme draws that line.
 * This behavior does not vary across directions.
 */
configs({ modes: ['ios'], directions: ['ltr'] }).forEach(({ config, screenshot, title }) => {
  test.describe(title('accordion: line at device resolution'), () => {
    // Resets the 1x that ios tests get to the browser's own density
    test.use({ deviceScaleFactor: undefined });

    test('should not have visual regressions', async ({ page }) => {
      // The groups start 0, 1/3 and 2/3 of a pixel down the page
      const group = (offset: string, color = '') => `
        <ion-accordion-group value="first" style="padding-top: ${offset}">
          <ion-accordion value="first">
            <ion-item slot="header" ${color}><ion-label>First</ion-label></ion-item>
            <div slot="content">Content</div>
          </ion-accordion>
          <ion-accordion value="second">
            <ion-item slot="header" ${color}><ion-label>Second</ion-label></ion-item>
            <div slot="content">Content</div>
          </ion-accordion>
          <ion-accordion value="third">
            <ion-item slot="header" ${color}><ion-label>Third</ion-label></ion-item>
            <div slot="content">Content</div>
          </ion-accordion>
        </ion-accordion-group>
      `;

      await page.setContent(
        `
        <style>
          #container {
            width: 120px;
          }
        </style>
        <div id="container">
          ${group('0px')}${group('0.33px')}${group('0.34px')}${group('0px', 'color="warning"')}
        </div>
        `,
        config
      );

      const container = page.locator('#container');

      await expect(container).toHaveScreenshot(screenshot(`accordion-line-device`), { scale: 'device' });
    });
  });
});
