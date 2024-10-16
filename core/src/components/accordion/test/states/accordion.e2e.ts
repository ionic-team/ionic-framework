import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs({ directions: ['ltr'], modes: ['ionic-md'] }).forEach(({ config, screenshot, title }) => {
  test.describe(title('accordion: states'), () => {
    test('should render disabled state', async ({ page }) => {
      await page.setContent(
        `
      <ion-accordion-group value="first">
        <ion-accordion value="first" disabled="true">
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

      await expect(accordionGroup).toHaveScreenshot(screenshot('accordion-states-disabled'));
    });

    test('should render activated state', async ({ page }) => {
      await page.setContent(
        `
      <ion-accordion-group value="first">
        <ion-accordion value="first">
          <ion-item slot="header" class="ion-activated">
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

      await expect(accordionGroup).toHaveScreenshot(screenshot('accordion-states-activated'));
    });

    test('should render focused state', async ({ page }) => {
      await page.setContent(
        `
      <ion-accordion-group value="first">
        <ion-accordion value="first">
          <ion-item slot="header" class="ion-focused">
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

      await expect(accordionGroup).toHaveScreenshot(screenshot('accordion-states-focused'));
    });

    test('should render disabled state when group is inset', async ({ page }) => {
      await page.setContent(
        `
      <ion-accordion-group value="first" expand="inset">
        <ion-accordion value="first" disabled="true">
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

      await expect(accordionGroup).toHaveScreenshot(screenshot('accordion-states-inset-disabled'));
    });

    test('should render activated state when group is inset', async ({ page }) => {
      await page.setContent(
        `
      <ion-accordion-group value="first" expand="inset">
        <ion-accordion value="first">
          <ion-item slot="header" class="ion-activated">
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

      await expect(accordionGroup).toHaveScreenshot(screenshot('accordion-states-inset-activated'));
    });

    test('should render focused state when group is inset', async ({ page }) => {
      await page.setContent(
        `
      <ion-accordion-group value="first" expand="inset">
        <ion-accordion value="first">
          <ion-item slot="header" class="ion-focused">
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

      await expect(accordionGroup).toHaveScreenshot(screenshot('accordion-states-inset-focused'));
    });
  });
});
