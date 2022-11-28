import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('segment: toolbar', () => {
  test.describe('segment: rendering', () => {
    test('should not have visual regressions when used in a toolbar without color', async ({ page }) => {
      await page.setContent(`
        <ion-header>
          <ion-toolbar>
            <ion-segment value="a">
              <ion-segment-button value="a">First</ion-segment-button>
              <ion-segment-button value="b">Second</ion-segment-button>
              <ion-segment-button value="c" disabled="true">Third</ion-segment-button>
            </ion-segment>
          </ion-toolbar>
        </ion-header>
      `);

      const header = page.locator('ion-header');

      expect(await header.screenshot()).toMatchSnapshot(`segment-toolbar-${page.getSnapshotSettings()}.png`);
    });

    test('should not have visual regressions when used in a toolbar with color', async ({ page }) => {
      await page.setContent(`
        <ion-header>
          <ion-toolbar color="primary">
            <ion-segment value="a">
              <ion-segment-button value="a">First</ion-segment-button>
              <ion-segment-button value="b">Second</ion-segment-button>
              <ion-segment-button value="c" disabled="true">Third</ion-segment-button>
            </ion-segment>
          </ion-toolbar>
          <ion-toolbar color="light">
            <ion-segment value="a">
              <ion-segment-button value="a">First</ion-segment-button>
              <ion-segment-button value="b">Second</ion-segment-button>
              <ion-segment-button value="c" disabled="true">Third</ion-segment-button>
            </ion-segment>
          </ion-toolbar>
          <ion-toolbar color="medium">
            <ion-segment value="a">
              <ion-segment-button value="a">First</ion-segment-button>
              <ion-segment-button value="b">Second</ion-segment-button>
              <ion-segment-button value="c" disabled="true">Third</ion-segment-button>
            </ion-segment>
          </ion-toolbar>
          <ion-toolbar color="dark">
            <ion-segment value="a">
              <ion-segment-button value="a">First</ion-segment-button>
              <ion-segment-button value="b">Second</ion-segment-button>
              <ion-segment-button value="c" disabled="true">Third</ion-segment-button>
            </ion-segment>
          </ion-toolbar>
        </ion-header>
      `);

      const header = page.locator('ion-header');

      expect(await header.screenshot()).toMatchSnapshot(`segment-toolbar-color-${page.getSnapshotSettings()}.png`);
    });

    test('should not inherit height when segment is MD and toolbar is iOS', async ({ page, skip }) => {
      skip.rtl();
      skip.mode('ios', 'We manually set the mode in this test, so the automatic mode switching is not needed');

      test.info().annotations.push({
        type: 'issue',
        description: 'https://github.com/ionic-team/ionic-framework/issues/18617',
      });

      await page.setContent(`
        <ion-header>
          <ion-toolbar mode="ios" color="primary">
            <ion-segment mode="md" value="a">
              <ion-segment-button value="a">First</ion-segment-button>
              <ion-segment-button value="b">Second</ion-segment-button>
              <ion-segment-button value="c" disabled="true">Third</ion-segment-button>
            </ion-segment>
          </ion-toolbar>
        </ion-header>
      `);

      const header = page.locator('ion-header');

      expect(await header.screenshot()).toMatchSnapshot(
        `segment-toolbar-height-inherit-${page.getSnapshotSettings()}.png`
      );
    });
  });
});
