import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs().forEach(({ config, screenshot, title }) => {
  test.describe(title('breadcrumbs: basic'), () => {
    test('should not have visual regressions', async ({ page }) => {
      await page.setContent(
        `
        <ion-breadcrumbs>
          <ion-breadcrumb>First</ion-breadcrumb>
          <ion-breadcrumb>Second</ion-breadcrumb>
          <ion-breadcrumb>Third</ion-breadcrumb>
          <ion-breadcrumb>Fourth</ion-breadcrumb>
        </ion-breadcrumbs>
      `,
        config
      );

      const breadcrumbs = page.locator('ion-breadcrumbs');

      await expect(breadcrumbs).toHaveScreenshot(screenshot(`breadcrumbs-basic`));
    });

    test('should not have visual regressions with links', async ({ page }) => {
      await page.setContent(
        `
        <ion-breadcrumbs>
          <ion-breadcrumb href="#">First</ion-breadcrumb>
          <ion-breadcrumb href="#">Second</ion-breadcrumb>
          <ion-breadcrumb href="#">Third</ion-breadcrumb>
          <ion-breadcrumb>Fourth</ion-breadcrumb>
        </ion-breadcrumbs>
      `,
        config
      );

      const breadcrumbs = page.locator('ion-breadcrumbs');

      await expect(breadcrumbs).toHaveScreenshot(screenshot(`breadcrumbs-links`));
    });

    test('should not have visual regressions with custom separators', async ({ page }) => {
      await page.setContent(
        `
        <ion-breadcrumbs>
          <ion-breadcrumb>
            First
            <ion-icon slot="separator" name="arrow-forward"></ion-icon>
          </ion-breadcrumb>
          <ion-breadcrumb>
            Second
            <ion-icon slot="separator" name="arrow-forward"></ion-icon>
          </ion-breadcrumb>
          <ion-breadcrumb>
            Third
            <ion-icon slot="separator" name="arrow-forward"></ion-icon>
          </ion-breadcrumb>
          <ion-breadcrumb>
            Fourth
          </ion-breadcrumb>
        </ion-breadcrumbs>
      `,
        config
      );

      const breadcrumbs = page.locator('ion-breadcrumbs');

      await expect(breadcrumbs).toHaveScreenshot(screenshot(`breadcrumbs-custom-separators`));
    });

    test('should not have visual regressions with slotted start icons', async ({ page }) => {
      await page.setContent(
        `
        <ion-breadcrumbs>
          <ion-breadcrumb>
            <ion-icon slot="start" name="home"></ion-icon>
            First
          </ion-breadcrumb>
          <ion-breadcrumb>
            <ion-icon slot="start" name="folder"></ion-icon>
            Second
          </ion-breadcrumb>
          <ion-breadcrumb>
            <ion-icon slot="start" name="folder"></ion-icon>
            Third
          </ion-breadcrumb>
          <ion-breadcrumb>
            <ion-icon slot="start" name="document"></ion-icon>
            Fourth
          </ion-breadcrumb>
        </ion-breadcrumbs>
      `,
        config
      );

      const breadcrumbs = page.locator('ion-breadcrumbs');

      await expect(breadcrumbs).toHaveScreenshot(screenshot(`breadcrumbs-slotted-start-icons`));
    });

    test('should not have visual regressions with slotted end icons', async ({ page }) => {
      await page.setContent(
        `
        <ion-breadcrumbs>
          <ion-breadcrumb>
            First
            <ion-icon slot="end" name="home"></ion-icon>
          </ion-breadcrumb>
          <ion-breadcrumb>
            Second
            <ion-icon slot="end" name="folder"></ion-icon>
          </ion-breadcrumb>
          <ion-breadcrumb>
            Third
            <ion-icon slot="end" name="folder"></ion-icon>
          </ion-breadcrumb>
          <ion-breadcrumb>
            Fourth
            <ion-icon slot="end" name="document"></ion-icon>
          </ion-breadcrumb>
        </ion-breadcrumbs>
      `,
        config
      );

      const breadcrumbs = page.locator('ion-breadcrumbs');

      await expect(breadcrumbs).toHaveScreenshot(screenshot(`breadcrumbs-slotted-end-icons`));
    });

    test('should not have visual regressions in a toolbar', async ({ page }) => {
      await page.setContent(
        `
        <ion-toolbar>
          <ion-breadcrumbs>
            <ion-breadcrumb>First</ion-breadcrumb>
            <ion-breadcrumb>Second</ion-breadcrumb>
            <ion-breadcrumb>Third</ion-breadcrumb>
            <ion-breadcrumb>Fourth</ion-breadcrumb>
          </ion-breadcrumbs>
        </ion-toolbar>
      `,
        config
      );

      const breadcrumbs = page.locator('ion-breadcrumbs');

      await expect(breadcrumbs).toHaveScreenshot(screenshot(`breadcrumbs-in-toolbar`));
    });
  });
});

/**
 * This behavior does not vary across directions
 */
configs({ directions: ['ltr'] }).forEach(({ config, screenshot, title }) => {
  test.describe(title('breadcrumbs: states'), () => {
    test('should not have visual regressions when focused', async ({ page }) => {
      await page.setContent(
        `
        <ion-breadcrumbs>
          <ion-breadcrumb href="#">First</ion-breadcrumb>
          <ion-breadcrumb href="#">Second</ion-breadcrumb>
          <ion-breadcrumb href="#" class="ion-focused">Third</ion-breadcrumb>
          <ion-breadcrumb>Fourth</ion-breadcrumb>
        </ion-breadcrumbs>
      `,
        config
      );

      const breadcrumbs = page.locator('ion-breadcrumbs');
      await expect(breadcrumbs).toHaveScreenshot(screenshot(`breadcrumbs-focused`));
    });

    test('should not have visual regressions when all breadcrumbs are disabled', async ({ page }) => {
      await page.setContent(
        `
        <ion-breadcrumbs>
          <ion-breadcrumb disabled>First</ion-breadcrumb>
          <ion-breadcrumb disabled>Second</ion-breadcrumb>
          <ion-breadcrumb disabled>Third</ion-breadcrumb>
          <ion-breadcrumb disabled>Fourth</ion-breadcrumb>
        </ion-breadcrumbs>
      `,
        config
      );

      const breadcrumbs = page.locator('ion-breadcrumbs');

      await expect(breadcrumbs).toHaveScreenshot(screenshot(`breadcrumbs-all-disabled`));
    });

    test('should not have visual regressions when one breadcrumb is disabled', async ({ page }) => {
      await page.setContent(
        `
        <ion-breadcrumbs>
          <ion-breadcrumb>First</ion-breadcrumb>
          <ion-breadcrumb disabled>Second</ion-breadcrumb>
          <ion-breadcrumb>Third</ion-breadcrumb>
          <ion-breadcrumb>Fourth</ion-breadcrumb>
        </ion-breadcrumbs>
      `,
        config
      );

      const breadcrumbs = page.locator('ion-breadcrumbs');

      await expect(breadcrumbs).toHaveScreenshot(screenshot(`breadcrumbs-one-disabled`));
    });

    test('should not have visual regressions when setting a different breadcrumb to active', async ({ page }) => {
      await page.setContent(
        `
        <ion-breadcrumbs>
          <ion-breadcrumb>First</ion-breadcrumb>
          <ion-breadcrumb>Second</ion-breadcrumb>
          <ion-breadcrumb active>Third</ion-breadcrumb>
          <ion-breadcrumb>Fourth</ion-breadcrumb>
        </ion-breadcrumbs>
      `,
        config
      );

      const breadcrumbs = page.locator('ion-breadcrumbs');

      await expect(breadcrumbs).toHaveScreenshot(screenshot(`breadcrumbs-custom-active`));
    });
  });
});
