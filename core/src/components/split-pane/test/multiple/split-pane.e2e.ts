import { expect } from '@playwright/test';
import {
  configs,
  test,
  Viewports,
} from '@utils/test/playwright';

configs({
  modes: ['ios'],
  directions: ['ltr'],
}).forEach(({ title, config }) => {
  test.describe(
    title('split-pane: multiple'),
    () => {
      test('using multiple split panes should not hide a menu in another split pane', async ({
        page,
      }) => {
        test.info().annotations.push({
          type: 'issue',
          description:
            'https://github.com/ionic-team/ionic-framework/issues/18683',
        });

        await page.setViewportSize(
          Viewports.large
        );
        await page.goto(
          `/src/components/split-pane/test/multiple`,
          config
        );

        const paneOneMenuOne =
          page.locator(
            'ion-menu#pane-one-menu-one'
          );
        const paneOneMenuTwo =
          page.locator(
            'ion-menu#pane-one-menu-two'
          );

        const paneTwoMenuOne =
          page.locator(
            'ion-menu#pane-two-menu-one'
          );
        const paneTwoMenuTwo =
          page.locator(
            'ion-menu#pane-two-menu-two'
          );

        const showPaneOne =
          page.locator(
            'button#show-pane-one'
          );
        const showPaneTwo =
          page.locator(
            'button#show-pane-two'
          );

        await expect(
          paneOneMenuOne
        ).toBeVisible();
        await expect(
          paneOneMenuTwo
        ).toBeVisible();

        await showPaneTwo.click();

        await expect(
          paneTwoMenuOne
        ).toBeVisible();
        await expect(
          paneTwoMenuTwo
        ).toBeVisible();

        await showPaneOne.click();

        await expect(
          paneOneMenuOne
        ).toBeVisible();
        await expect(
          paneOneMenuTwo
        ).toBeVisible();
      });
    }
  );
});
