import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

/**
 * This behavior does not vary across directions
 */
configs({ directions: ['ltr'] }).forEach(({ config, screenshot, title }) => {
  test.describe(title('breadcrumbs: collapsed'), () => {
    test('should show 1 before and 1 after collapse with max items set to 4', async ({ page }) => {
      await page.setContent(
        `
        <ion-breadcrumbs max-items="4">
          <ion-breadcrumb href="#"> Home </ion-breadcrumb>
          <ion-breadcrumb href="#electronics"> Electronics </ion-breadcrumb>
          <ion-breadcrumb href="#photography"> Photography </ion-breadcrumb>
          <ion-breadcrumb href="#cameras"> Cameras </ion-breadcrumb>
          <ion-breadcrumb href="#film"> Film </ion-breadcrumb>
          <ion-breadcrumb> 35 mm </ion-breadcrumb>
        </ion-breadcrumbs>
      `,
        config
      );

      const breadcrumbs = page.locator('ion-breadcrumbs');

      await expect(breadcrumbs).toHaveScreenshot(screenshot(`breadcrumbs-collapsed-max-items`));
    });

    test('should show 0 before and 1 after collapse with max items set to 4 and items before collapse set to 0', async ({
      page,
    }) => {
      await page.setContent(
        `
        <ion-breadcrumbs max-items="4" items-before-collapse="0">
          <ion-breadcrumb href="#"> Home </ion-breadcrumb>
          <ion-breadcrumb href="#electronics"> Electronics </ion-breadcrumb>
          <ion-breadcrumb href="#photography"> Photography </ion-breadcrumb>
          <ion-breadcrumb href="#cameras"> Cameras </ion-breadcrumb>
          <ion-breadcrumb href="#film"> Film </ion-breadcrumb>
          <ion-breadcrumb> 35 mm </ion-breadcrumb>
        </ion-breadcrumbs>
      `,
        config
      );

      const breadcrumbs = page.locator('ion-breadcrumbs');

      await expect(breadcrumbs).toHaveScreenshot(screenshot(`breadcrumbs-collapsed-items-before-collapse-0`));
    });

    test('should show 2 before and 1 after collapse with max items set to 4 and items before collapse set to 2', async ({
      page,
    }) => {
      await page.setContent(
        `
        <ion-breadcrumbs max-items="4" items-before-collapse="2">
          <ion-breadcrumb href="#"> Home </ion-breadcrumb>
          <ion-breadcrumb href="#electronics"> Electronics </ion-breadcrumb>
          <ion-breadcrumb href="#photography"> Photography </ion-breadcrumb>
          <ion-breadcrumb href="#cameras"> Cameras </ion-breadcrumb>
          <ion-breadcrumb href="#film"> Film </ion-breadcrumb>
          <ion-breadcrumb> 35 mm </ion-breadcrumb>
        </ion-breadcrumbs>
      `,
        config
      );

      const breadcrumbs = page.locator('ion-breadcrumbs');

      await expect(breadcrumbs).toHaveScreenshot(screenshot(`breadcrumbs-collapsed-items-before-collapse-2`));
    });

    test('should show 2 before and 0 after collapse with max items set to 4 and items after collapse set to 0', async ({
      page,
    }) => {
      await page.setContent(
        `
        <ion-breadcrumbs max-items="4" items-after-collapse="0">
          <ion-breadcrumb href="#"> Home </ion-breadcrumb>
          <ion-breadcrumb href="#electronics"> Electronics </ion-breadcrumb>
          <ion-breadcrumb href="#photography"> Photography </ion-breadcrumb>
          <ion-breadcrumb href="#cameras"> Cameras </ion-breadcrumb>
          <ion-breadcrumb href="#film"> Film </ion-breadcrumb>
          <ion-breadcrumb> 35 mm </ion-breadcrumb>
        </ion-breadcrumbs>
      `,
        config
      );

      const breadcrumbs = page.locator('ion-breadcrumbs');

      await expect(breadcrumbs).toHaveScreenshot(screenshot(`breadcrumbs-collapsed-items-after-collapse-0`));
    });

    test('should show 2 before and 3 after collapse with max items set to 4 and items after collapse set to 3', async ({
      page,
    }) => {
      await page.setContent(
        `
        <ion-breadcrumbs max-items="4" items-after-collapse="3">
          <ion-breadcrumb href="#"> Home </ion-breadcrumb>
          <ion-breadcrumb href="#electronics"> Electronics </ion-breadcrumb>
          <ion-breadcrumb href="#photography"> Photography </ion-breadcrumb>
          <ion-breadcrumb href="#cameras"> Cameras </ion-breadcrumb>
          <ion-breadcrumb href="#film"> Film </ion-breadcrumb>
          <ion-breadcrumb> 35 mm </ion-breadcrumb>
        </ion-breadcrumbs>
      `,
        config
      );

      const breadcrumbs = page.locator('ion-breadcrumbs');

      await expect(breadcrumbs).toHaveScreenshot(screenshot(`breadcrumbs-collapsed-items-after-collapse-3`));
    });

    test('should show 2 before and 2 after collapse with max items set to 4 and items before collapse set to 2 and items after collapse set to 2', async ({
      page,
    }) => {
      await page.setContent(
        `
        <ion-breadcrumbs max-items="4" items-before-collapse="2" items-after-collapse="2">
          <ion-breadcrumb href="#"> Home </ion-breadcrumb>
          <ion-breadcrumb href="#electronics"> Electronics </ion-breadcrumb>
          <ion-breadcrumb href="#photography"> Photography </ion-breadcrumb>
          <ion-breadcrumb href="#cameras"> Cameras </ion-breadcrumb>
          <ion-breadcrumb href="#film"> Film </ion-breadcrumb>
          <ion-breadcrumb> 35 mm </ion-breadcrumb>
        </ion-breadcrumbs>
      `,
        config
      );

      const breadcrumbs = page.locator('ion-breadcrumbs');

      await expect(breadcrumbs).toHaveScreenshot(
        screenshot(`breadcrumbs-collapsed-items-before-collapse-2-items-after-collapse-2`)
      );
    });

    test('should show all breadcrumbs with max items set to 4 and items before collapse set to 3 and items after collapse set to 2', async ({
      page,
    }) => {
      await page.setContent(
        `
        <ion-breadcrumbs max-items="4" items-before-collapse="3" items-after-collapse="2">
          <ion-breadcrumb href="#"> Home </ion-breadcrumb>
          <ion-breadcrumb href="#electronics"> Electronics </ion-breadcrumb>
          <ion-breadcrumb href="#photography"> Photography </ion-breadcrumb>
          <ion-breadcrumb href="#cameras"> Cameras </ion-breadcrumb>
          <ion-breadcrumb href="#film"> Film </ion-breadcrumb>
          <ion-breadcrumb> 35 mm </ion-breadcrumb>
        </ion-breadcrumbs>
      `,
        config
      );

      const visibleBreadcrumbs = page.locator('ion-breadcrumb:not(.breadcrumb-collapsed)');
      const collapsedIndicator = page.locator('.breadcrumbs-collapsed-indicator');

      await expect(visibleBreadcrumbs).toHaveCount(6);
      await expect(collapsedIndicator).not.toBeVisible();
    });

    test('should show all breadcrumbs with max items set to 4 and items before collapse set to 4 and items after collapse set to 4', async ({
      page,
    }) => {
      await page.setContent(
        `
        <ion-breadcrumbs max-items="4" items-before-collapse="4" items-after-collapse="4">
          <ion-breadcrumb href="#"> Home </ion-breadcrumb>
          <ion-breadcrumb href="#electronics"> Electronics </ion-breadcrumb>
          <ion-breadcrumb href="#photography"> Photography </ion-breadcrumb>
          <ion-breadcrumb href="#cameras"> Cameras </ion-breadcrumb>
          <ion-breadcrumb href="#film"> Film </ion-breadcrumb>
          <ion-breadcrumb> 35 mm </ion-breadcrumb>
        </ion-breadcrumbs>
      `,
        config
      );

      const visibleBreadcrumbs = page.locator('ion-breadcrumb:not(.breadcrumb-collapsed)');
      const collapsedIndicator = page.locator('.breadcrumbs-collapsed-indicator');

      await expect(visibleBreadcrumbs).toHaveCount(6);
      await expect(collapsedIndicator).not.toBeVisible();
    });
  });
});
