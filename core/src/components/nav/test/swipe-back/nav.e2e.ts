import { expect } from '@playwright/test';
import type { E2EPage, E2EPageOptions } from '@utils/test/playwright';
import { configs, dragElementBy, test } from '@utils/test/playwright';

/**
 * Renders an `ion-nav` and pushes a second page. The `extraScript`
 * runs before Ionic loads, so it can change the global config.
 */
const pushSecondPage = async (page: E2EPage, config: E2EPageOptions, navAttrs = '', extraScript = '') => {
  await page.setContent(
    `
    <ion-app>
      <ion-nav ${navAttrs}></ion-nav>
    </ion-app>
    <script>
      ${extraScript}
      window.createPage = (id) => {
        const el = document.createElement('div');
        el.id = id;
        el.className = 'ion-page';
        el.innerHTML = '<ion-content>' + id + '</ion-content>';
        return el;
      };
      document.querySelector('ion-nav').root = createPage('page-one');
    </script>
  `,
    config
  );

  const nav = page.locator('ion-nav');
  await nav.evaluate((el: HTMLIonNavElement) => el.push((window as any).createPage('page-two')));
  await expect(page.locator('#page-two')).toBeVisible();

  return nav;
};

/**
 * Starts a swipe to go back and lets go partway across, so the user
 * should stay on the current page.
 */
const abandonSwipeBack = async (page: E2EPage) => {
  const nav = page.locator('ion-nav');
  const box = (await nav.boundingBox())!;
  const startX = box.x + 5;
  const y = box.y + box.height / 2;

  await dragElementBy(nav, page, 60, 0, startX, y, false);

  /**
   * A quick drag is released with enough velocity to complete
   * the swipe, so slow down before letting go.
   */
  for (let i = 1; i <= 3; i++) {
    await page.mouse.move(startX + 60 + i, y);
    await page.waitForTimeout(50);
  }

  await page.mouse.up();
  await page.waitForChanges();
};

/**
 * Swipe to go back is only enabled by default in iOS mode,
 * and this behavior does not vary across directions.
 */
configs({ modes: ['ios'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('nav: swipe back'), () => {
    test('should not pop the page when an abandoned swipe starts on a non-animated nav', async ({ page }, testInfo) => {
      testInfo.annotations.push({
        type: 'issue',
        description: 'https://github.com/ionic-team/ionic-framework/issues/29793',
      });

      const nav = await pushSecondPage(page, config, 'animated="false"');

      await abandonSwipeBack(page);

      await expect(page.locator('#page-two')).toBeVisible();
      expect(await nav.evaluate((el: HTMLIonNavElement) => el.getLength())).toBe(2);
    });

    test('should not pop the page when an abandoned swipe starts with animations disabled globally', async ({
      page,
    }, testInfo) => {
      testInfo.annotations.push({
        type: 'issue',
        description: 'https://github.com/ionic-team/ionic-framework/issues/29793',
      });

      const nav = await pushSecondPage(page, config, '', 'window.Ionic.config.animated = false;');

      await abandonSwipeBack(page);

      await expect(page.locator('#page-two')).toBeVisible();
      expect(await nav.evaluate((el: HTMLIonNavElement) => el.getLength())).toBe(2);
    });

    test('should not click the page when an abandoned swipe is released on a non-animated nav', async ({
      page,
    }, testInfo) => {
      testInfo.annotations.push({
        type: 'issue',
        description: 'https://github.com/ionic-team/ionic-framework/issues/29793',
      });

      await pushSecondPage(page, config, 'animated="false"');

      await page.locator('#page-two').evaluate((pageTwo) => {
        const button = document.createElement('button');
        button.style.cssText = 'position: absolute; inset: 0; width: 100%; height: 100%;';
        button.addEventListener('click', () => ((window as any).pageClicked = true));
        pageTwo.appendChild(button);
      });

      await abandonSwipeBack(page);

      expect(await page.evaluate(() => (window as any).pageClicked)).toBeUndefined();
    });

    test('should not block clicks on a non-animated nav that is moved during a swipe', async ({ page }) => {
      const nav = await pushSecondPage(page, config, 'animated="false"');
      const box = (await nav.boundingBox())!;

      await dragElementBy(nav, page, 60, 0, box.x + 5, box.y + box.height / 2, false);
      await expect(nav).toHaveCSS('pointer-events', 'none');

      await nav.evaluate((el) => document.body.appendChild(el));

      await expect(nav).not.toHaveCSS('pointer-events', 'none');
      await page.mouse.up();
    });

    test('should pop the page when a swipe completes on a non-animated nav', async ({ page }) => {
      const nav = await pushSecondPage(page, config, 'animated="false"');
      const box = (await nav.boundingBox())!;

      await dragElementBy(nav, page, box.width * 0.75, 0, box.x + 5);

      await expect.poll(() => nav.evaluate((el: HTMLIonNavElement) => el.getLength())).toBe(1);
      await expect(page.locator('#page-one')).toBeVisible();
    });

    test('should pop the page when a swipe completes on an animated nav', async ({ page }) => {
      const nav = await pushSecondPage(page, config);
      const box = (await nav.boundingBox())!;

      await dragElementBy(nav, page, box.width * 0.75, 0, box.x + 5);

      await expect.poll(() => nav.evaluate((el: HTMLIonNavElement) => el.getLength())).toBe(1);
      await expect(page.locator('#page-one')).toBeVisible();
    });
  });
});
