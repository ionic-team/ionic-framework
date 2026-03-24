import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs({ directions: ['ltr'] }).forEach(({ config, screenshot, title }) => {
  test.describe(title('accordion: nested'), () => {
    test('parent and child should not be disabled', async ({ page }) => {
      await page.goto(`/src/components/accordion/test/nested`, config);

      const enabledGroup = page.locator('ion-accordion-group#enabled');

      await expect(enabledGroup).toHaveScreenshot(screenshot('accordion-nested-enabled'));
    });

    test('parent should not be disabled when only child is disabled', async ({ page }) => {
      await page.goto(`/src/components/accordion/test/nested`, config);

      const nestedDisabledGroup = page.locator('ion-accordion-group#nested-disabled');

      await expect(nestedDisabledGroup).toHaveScreenshot(screenshot('accordion-child-disabled'));
    });

    test('parent and child should be disabled when parent is disabled', async ({ page }) => {
      await page.goto(`/src/components/accordion/test/nested`, config);

      const parentDisabledGroup = page.locator('ion-accordion-group#parent-disabled');

      await expect(parentDisabledGroup).toHaveScreenshot(screenshot('accordion-parent-disabled'));
    });
  });
});

configs({ directions: ['ltr'], modes: ['ionic-md'] }).forEach(({ config, screenshot, title }) => {
  test.describe(title('accordion: nested'), () => {
    test('parent and child should not be disabled', async ({ page }) => {
      await page.setContent(
        `
        <ion-accordion-group value="first">
          <ion-accordion value="first">
            <ion-item slot="header">
              <ion-label>Attractions</ion-label>
            </ion-item>
            <ion-accordion-group slot="content" value="second">
              <ion-accordion value="first">
                <ion-item slot="header">
                  <ion-label>First Item</ion-label>
                </ion-item>
                <div slot="content">First item content!</div>
              </ion-accordion>
              <ion-accordion value="second">
                <ion-item slot="header">
                  <ion-label>Second Item</ion-label>
                </ion-item>
                <div slot="content">Second item content!</div>
              </ion-accordion>
              <ion-accordion value="third">
                <ion-item slot="header">
                  <ion-label>Third Item</ion-label>
                </ion-item>
                <div slot="content">Third item content!</div>
              </ion-accordion>
            </ion-accordion-group>
          </ion-accordion>
        </ion-accordion-group>
        `,
        config
      );

      const accordionGroup = page.locator('ion-accordion-group');

      await expect(accordionGroup).toHaveScreenshot(screenshot('accordion-nested-enabled'));
    });

    test('parent should not be disabled when only child is disabled', async ({ page }) => {
      await page.setContent(
        `
        <ion-accordion-group value="first">
          <ion-accordion value="first">
            <ion-item slot="header">
              <ion-label>Attractions</ion-label>
            </ion-item>
            <ion-accordion-group slot="content" value="second" disabled="true">
              <ion-accordion value="first">
                <ion-item slot="header">
                  <ion-label>First Item</ion-label>
                </ion-item>
                <div slot="content">First item content!</div>
              </ion-accordion>
              <ion-accordion value="second">
                <ion-item slot="header">
                  <ion-label>Second Item</ion-label>
                </ion-item>
                <div slot="content">Second item content!</div>
              </ion-accordion>
              <ion-accordion value="third">
                <ion-item slot="header">
                  <ion-label>Third Item</ion-label>
                </ion-item>
                <div slot="content">Third item content!</div>
              </ion-accordion>
            </ion-accordion-group>
          </ion-accordion>
        </ion-accordion-group>
        `,
        config
      );

      const accordionGroup = page.locator('ion-accordion-group');

      await expect(accordionGroup).toHaveScreenshot(screenshot('accordion-child-disabled'));
    });

    test('parent and child should be disabled when parent is disabled', async ({ page }) => {
      await page.setContent(
        `
        <ion-accordion-group value="first" disabled="true">
          <ion-accordion value="first">
            <ion-item slot="header">
              <ion-label>Attractions</ion-label>
            </ion-item>
            <ion-accordion-group slot="content" value="second">
              <ion-accordion value="first">
                <ion-item slot="header">
                  <ion-label>First Item</ion-label>
                </ion-item>
                <div slot="content">First item content!</div>
              </ion-accordion>
              <ion-accordion value="second">
                <ion-item slot="header">
                  <ion-label>Second Item</ion-label>
                </ion-item>
                <div slot="content">Second item content!</div>
              </ion-accordion>
              <ion-accordion value="third">
                <ion-item slot="header">
                  <ion-label>Third Item</ion-label>
                </ion-item>
                <div slot="content">Third item content!</div>
              </ion-accordion>
            </ion-accordion-group>
          </ion-accordion>
        </ion-accordion-group>
        `,
        config
      );

      const accordionGroup = page.locator('ion-accordion-group');

      await expect(accordionGroup).toHaveScreenshot(screenshot('accordion-parent-disabled'));
    });
  });
});
