import { expect } from '@playwright/test';
import type { E2EPage } from '@utils/test/playwright';
import { configs, test, Viewports } from '@utils/test/playwright';

/**
 * This behavior does not vary across modes/directions.
 */
configs({ directions: ['ltr'], modes: ['ios'] }).forEach(({ title, config }) => {
  test.describe(title('split-pane: nested menu'), () => {
    const setup = async (page: E2EPage) => {
      await page.setContent(
        `
        <ion-app>
          <ion-split-pane content-id="main">
            <ion-menu side="start" content-id="main" id="side-menu">
              <ion-content>Side Menu</ion-content>
            </ion-menu>
            <div class="ion-page" id="main">
              <ion-menu side="end" content-id="page-content" id="page-menu">
                <ion-content>Page Menu</ion-content>
              </ion-menu>
              <div class="ion-page" id="page-content">
                <ion-content>Main Content</ion-content>
              </div>
            </div>
          </ion-split-pane>
        </ion-app>
      `,
        config
      );
    };

    test('should open a menu inside the main content when the split pane is visible', async ({ page }, testInfo) => {
      testInfo.annotations.push({
        type: 'issue',
        description: 'https://github.com/ionic-team/ionic-framework/issues/30591',
      });

      await page.setViewportSize(Viewports.large);
      await setup(page);

      const sideMenu = page.locator('#side-menu');
      const pageMenu = page.locator('#page-menu');

      await expect(sideMenu).toBeVisible();
      await expect(sideMenu).toHaveClass(/split-pane-side/);
      await expect(pageMenu).not.toHaveClass(/split-pane-side/);

      const didOpen = await pageMenu.evaluate((el: HTMLIonMenuElement) => el.open());

      expect(didOpen).toBe(true);
      await expect(pageMenu).toHaveClass(/show-menu/);
    });

    test('should open a menu inside the main content after the split pane becomes visible', async ({
      page,
    }, testInfo) => {
      testInfo.annotations.push({
        type: 'issue',
        description: 'https://github.com/ionic-team/ionic-framework/issues/30591',
      });

      await page.setViewportSize(Viewports.tablet.portrait);
      await setup(page);

      const sideMenu = page.locator('#side-menu');
      const pageMenu = page.locator('#page-menu');

      await expect(sideMenu).toBeHidden();

      await page.setViewportSize(Viewports.large);
      await expect(sideMenu).toBeVisible();

      const didOpen = await pageMenu.evaluate((el: HTMLIonMenuElement) => el.open());

      expect(didOpen).toBe(true);
      await expect(pageMenu).toHaveClass(/show-menu/);
    });

    test('should treat a menu as a side pane of a split pane that is the main content of another split pane', async ({
      page,
    }) => {
      await page.setViewportSize(Viewports.large);
      await page.setContent(
        `
        <ion-app>
          <ion-split-pane content-id="outer-main">
            <ion-menu side="start" content-id="outer-main" id="outer-menu">
              <ion-content>Outer Menu</ion-content>
            </ion-menu>
            <ion-split-pane id="outer-main" content-id="inner-main">
              <ion-menu side="start" content-id="inner-main" id="inner-menu">
                <ion-content>Inner Menu</ion-content>
              </ion-menu>
              <div class="ion-page" id="inner-main">
                <ion-content>Main Content</ion-content>
              </div>
            </ion-split-pane>
          </ion-split-pane>
        </ion-app>
      `,
        config
      );

      const innerMenu = page.locator('#inner-menu');

      await expect(innerMenu).toHaveClass(/split-pane-side/);
      await expect(innerMenu).toHaveClass(/menu-pane-visible/);
    });
  });
});
