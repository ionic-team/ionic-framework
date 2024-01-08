import AxeBuilder from '@axe-core/playwright';
import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs({ directions: ['ltr'], themes: ['light', 'dark'] }).forEach(({ title, config }) => {
  test.describe(title('range: a11y'), () => {
    test('should not have accessibility violations', async ({ page }) => {
      await page.setContent(
        `
        <main>
          <ion-range value="50"><span slot="label">my label</span></ion-range>
          <ion-range label="my label"></ion-range>
          <ion-range aria-label="my aria label"></ion-range>
          <ion-range>
            <span slot="label">temperature</span>
            <ion-icon name="snow" slot="start" aria-hidden="true"></ion-icon>
            <ion-icon name="flame" slot="end" aria-hidden="true"></ion-icon>
          </ion-range>
        </main>
      `,
        config
      );

      const results = await new AxeBuilder({ page }).analyze();
      expect(results.violations).toEqual([]);
    });
  });
});

configs({ modes: ['md'], directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('range: a11y'), () => {
    test('should not have visual regressions', async ({ page }) => {
      await page.setContent(
        `<ion-app>
          <ion-content>
            <ion-range min="0" max="100" value="80" legacy="true"></ion-range>
          </ion-content>
        </ion-app>
          `,
        config
      );

      const range = page.locator('ion-range');
      const rangeHandle = range.locator('.range-knob-handle');

      await rangeHandle.evaluate((el) => el.classList.add('ion-focused'));
      await page.waitForChanges();

      await expect(range).toHaveScreenshot(screenshot(`range-focus`));

      const box = (await rangeHandle.boundingBox())!;
      const centerX = box.x + box.width / 2;
      const centerY = box.y + box.height / 2;

      await page.mouse.move(centerX, centerY);
      await page.mouse.down();
      await page.waitForChanges();

      await expect(range).toHaveScreenshot(screenshot(`range-active`));
    });
  });
});

configs({ directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('with pin'), () => {
    test('should not have visual regressions', async ({ page }) => {
      await page.setContent(
        `<ion-app>
          <ion-content>
            <ion-range min="0" max="100" value="50" pin="true" legacy="true"></ion-range>
          </ion-content>
        </ion-app>
        `,
        config
      );

      const range = page.locator('ion-range');
      const rangeHandle = range.locator('.range-knob-handle');

      await rangeHandle.evaluate((el) => el.classList.add('ion-focused'));
      await page.waitForChanges();

      await expect(range).toHaveScreenshot(screenshot(`range-focus-with-pin`));
    });
  });

  test.describe(title('range: font scaling'), () => {
    test('should scale text on larger font sizes', async ({ page }) => {
      // Capture both icons and text in the start/end slots
      await page.setContent(
        `
        <style>
          html {
            font-size: 310%;
          }
        </style>
        <ion-range value="50" label="Label" pin="true">
          <ion-icon name="snow" slot="start" aria-hidden="true"></ion-icon>
          <div name="snow" slot="end" aria-hidden="true">Warm</div>
        </ion-range>
      `,
        config
      );

      const range = page.locator('ion-range');
      const rangeHandle = range.locator('.range-knob-handle');

      // Capture the range pin in screenshots
      await rangeHandle.evaluate((el) => el.classList.add('ion-focused'));
      await page.waitForChanges();

      await expect(range).toHaveScreenshot(screenshot(`range-scale`));
    });
  });
});
