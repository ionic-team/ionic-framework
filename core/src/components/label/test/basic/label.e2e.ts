import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs().forEach(({ title, screenshot, config }) => {
  test.describe(title('label: rendering'), () => {
    test('should not have visual regressions', async ({ page }) => {
      await page.setContent(
        `
        <ion-label>My Label</ion-label>
      `,
        config
      );

      const labelEl = page.locator('ion-label');

      await expect(labelEl).toHaveScreenshot(screenshot(`label-basic`));
    });
    test('should not have visual regressions with fixed label', async ({ page }) => {
      await page.setContent(
        `
        <ion-item>
          <ion-label>My Label</ion-label>
        </ion-item>
      `,
        config
      );

      const itemEl = page.locator('ion-item');

      await expect(itemEl).toHaveScreenshot(screenshot(`label-fixed`));
    });
    test('should not have visual regressions with stacked label', async ({ page }) => {
      await page.setContent(
        `
        <ion-item>
          <ion-label position="stacked">My Label</ion-label>
          <ion-input aria-label="My Label"></ion-input>
        </ion-item>
      `,
        config
      );

      const itemEl = page.locator('ion-item');

      await expect(itemEl).toHaveScreenshot(screenshot(`label-stacked`));
    });
    test('should not have visual regressions with floating label', async ({ page }) => {
      await page.setContent(
        `
        <ion-item>
          <ion-label position="floating">My Label</ion-label>
          <ion-input aria-label="My Label"></ion-input>
        </ion-item>
      `,
        config
      );

      const itemEl = page.locator('ion-item');

      await expect(itemEl).toHaveScreenshot(screenshot(`label-floating`));
    });
  });
});

/**
 * This behavior does not vary across modes/directions.
 */
configs({ modes: ['md'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('label: inner content'), () => {
    test.beforeEach(async ({ page }) => {
      await page.setContent(
        `
        <ion-label>Initial</ion-label>
      `,
        config
      );
    });

    test('should render content set with innerHTML', async ({ page }, testInfo) => {
      testInfo.annotations.push({
        type: 'issue',
        description: 'https://github.com/ionic-team/ionic-framework/issues/31433',
      });

      const label = page.locator('ion-label');

      await label.evaluate((el: HTMLIonLabelElement) => {
        el.innerHTML = '<strong>test</strong>';
        // Changing a prop forces a re-render, which is when the content was hidden
        el.color = 'primary';
      });
      await page.waitForChanges();

      await expect(label).toBeVisible();
      await expect(label).toHaveText('test');
      await expect(label.locator('strong')).toBeVisible();
    });

    test('should render content set with innerText', async ({ page }, testInfo) => {
      testInfo.annotations.push({
        type: 'issue',
        description: 'https://github.com/ionic-team/ionic-framework/issues/31433',
      });

      const label = page.locator('ion-label');

      await label.evaluate((el: HTMLIonLabelElement) => {
        el.innerText = 'test';
        el.color = 'primary';
      });
      await page.waitForChanges();

      await expect(label).toBeVisible();
      await expect(label).toHaveText('test');
    });

    test('should keep content set with innerHTML across multiple re-renders', async ({ page }, testInfo) => {
      testInfo.annotations.push({
        type: 'issue',
        description: 'https://github.com/ionic-team/ionic-framework/issues/31433',
      });

      const label = page.locator('ion-label');

      await label.evaluate((el: HTMLIonLabelElement) => {
        el.innerHTML = 'first';
        el.color = 'primary';
      });
      await page.waitForChanges();

      await label.evaluate((el: HTMLIonLabelElement) => {
        el.innerHTML = 'second';
        el.color = 'secondary';
      });
      await page.waitForChanges();

      await expect(label).toBeVisible();
      await expect(label).toHaveText('second');
    });
  });
});
