import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs().forEach(({ config, screenshot, title }) => {
  test.describe(title('button: basic'), () => {
    test('example flaky test', async () => {
      if (Math.random() > 0.7) {
        expect(false).toBe(true);
      } else {
        expect(true).toBe(true);
      }
    });
    test('should not have visual regressions', async ({ page }) => {
      await page.goto(`/src/components/button/test/basic`, config);

      await page.setIonViewport();

      await expect(page).toHaveScreenshot(screenshot(`button-diff`));
    });
  });
});

configs({ directions: ['ltr'], modes: ['md'] }).forEach(({ config, title }) => {
  test.describe(title('button: basic'), () => {
    test('should correctly set fill to undefined', async ({ page }) => {
      test.info().annotations.push({
        type: 'issue',
        description: 'https://github.com/ionic-team/ionic-framework/issues/25886',
      });
      await page.setContent(
        `
        <ion-button fill="outline"></ion-button>
      `,
        config
      );

      const button = page.locator('ion-button');
      await expect(button).toHaveClass(/button-outline/);

      await button.evaluate((el: HTMLIonButtonElement) => (el.fill = undefined));
      await page.waitForChanges();

      await expect(button).toHaveClass(/button-solid/);
    });
  });
});

/**
 * Ripple effect is only available in MD mode.
 */
configs({ modes: ['md'] }).forEach(({ config, screenshot, title }) => {
  test.describe(title('button: ripple effect'), () => {
    test('should not have visual regressions', async ({ page }) => {
      await page.goto(`/src/components/button/test/basic?ionic:_testing=false`, config);

      const button = page.locator('#default');

      await button.scrollIntoViewIfNeeded();

      const boundingBox = await button.boundingBox();

      if (boundingBox) {
        await page.mouse.move(boundingBox.x + boundingBox.width / 2, boundingBox.y + boundingBox.height / 2);
        await page.mouse.down();
      }

      await page.waitForSelector('#default.ion-activated');

      await expect(button).toHaveScreenshot(screenshot(`button-ripple-effect`));
    });
  });
});
