import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs().forEach(({ title, screenshot, config }) => {
  test.describe(title('segment: rendering'), () => {
    test('should not have visual regressions when used in a toolbar without color', async ({ page }) => {
      await page.setContent(
        `
        <ion-header>
          <ion-toolbar>
            <ion-segment value="a">
              <ion-segment-button value="a">
                <ion-label>First</ion-label>
              </ion-segment-button>
              <ion-segment-button value="b">
                <ion-label>Second</ion-label>
              </ion-segment-button>
              <ion-segment-button value="c" disabled="true">
                <ion-label>Third</ion-label>
              </ion-segment-button>
            </ion-segment>
          </ion-toolbar>
        </ion-header>
      `,
        config
      );

      const header = page.locator('ion-header');

      await expect(header).toHaveScreenshot(screenshot(`segment-toolbar`));
    });

    test('should not have visual regressions when used in a toolbar with color', async ({ page }) => {
      await page.setContent(
        `
        <ion-header>
          <ion-toolbar color="primary">
            <ion-segment value="a">
              <ion-segment-button value="a">
                <ion-label>First</ion-label>
              </ion-segment-button>
              <ion-segment-button value="b">
                <ion-label>Second</ion-label>
              </ion-segment-button>
              <ion-segment-button value="c" disabled="true">
                <ion-label>Third</ion-label>
              </ion-segment-button>
            </ion-segment>
          </ion-toolbar>
          <ion-toolbar color="light">
            <ion-segment value="a">
              <ion-segment-button value="a">
                <ion-label>First</ion-label>
              </ion-segment-button>
              <ion-segment-button value="b">
                <ion-label>Second</ion-label>
              </ion-segment-button>
              <ion-segment-button value="c" disabled="true">
                <ion-label>Third</ion-label>
              </ion-segment-button>
            </ion-segment>
          </ion-toolbar>
          <ion-toolbar color="medium">
            <ion-segment value="a">
              <ion-segment-button value="a">
                <ion-label>First</ion-label>
              </ion-segment-button>
              <ion-segment-button value="b">
                <ion-label>Second</ion-label>
              </ion-segment-button>
              <ion-segment-button value="c" disabled="true">
                <ion-label>Third</ion-label>
              </ion-segment-button>
            </ion-segment>
          </ion-toolbar>
          <ion-toolbar color="dark">
            <ion-segment value="a">
              <ion-segment-button value="a">
                <ion-label>First</ion-label>
              </ion-segment-button>
              <ion-segment-button value="b">
                <ion-label>Second</ion-label>
              </ion-segment-button>
              <ion-segment-button value="c" disabled="true">
                <ion-label>Third</ion-label>
              </ion-segment-button>
            </ion-segment>
          </ion-toolbar>
        </ion-header>
      `,
        config
      );

      const header = page.locator('ion-header');

      await expect(header).toHaveScreenshot(screenshot(`segment-toolbar-color`));
    });
  });
});

/**
 * We manually set the mode in this test, so the automatic mode switching is not needed
 */
configs({ modes: ['md'], directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('segment: feature rendering'), () => {
    test('should not inherit height when segment is MD and toolbar is iOS', async ({ page }) => {
      test.info().annotations.push({
        type: 'issue',
        description: 'https://github.com/ionic-team/ionic-framework/issues/18617',
      });

      await page.setContent(
        `
        <ion-header>
          <ion-toolbar mode="ios" color="primary">
            <ion-segment mode="md" value="a">
              <ion-segment-button value="a">
                <ion-label>First</ion-label>
              </ion-segment-button>
              <ion-segment-button value="b">
                <ion-label>Second</ion-label>
              </ion-segment-button>
              <ion-segment-button value="c" disabled="true">
                <ion-label>Third</ion-label>
              </ion-segment-button>
            </ion-segment>
          </ion-toolbar>
        </ion-header>
      `,
        config
      );

      const header = page.locator('ion-header');

      await expect(header).toHaveScreenshot(screenshot(`segment-toolbar-height-inherit`));
    });
  });
});
