import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs({ modes: ['md'], directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('input: highlights'), () => {
    test.describe('input: no fill', () => {
      test('should render valid state correctly', async ({ page }) => {
        await page.setContent(
          `
          <ion-select value="apple" class="ion-valid ion-focused" label="Favorite Fruit">
            <ion-select-option value="apple">Apple</ion-select-option>
          </ion-select>
        `,
          config
        );

        const select = page.locator('ion-select');
        await expect(select).toHaveScreenshot(screenshot(`select-no-fill-valid`));
      });
      test('should render invalid state correctly', async ({ page }) => {
        await page.setContent(
          `
          <ion-select value="apple" class="ion-touched ion-invalid" label="Favorite Fruit">
            <ion-select-option value="apple">Apple</ion-select-option>
          </ion-select>
        `,
          config
        );

        const select = page.locator('ion-select');
        await expect(select).toHaveScreenshot(screenshot(`select-no-fill-invalid`));
      });
      test('should render focused state correctly', async ({ page }) => {
        await page.setContent(
          `
          <ion-select value="apple" class="ion-focused" label="Favorite Fruit">
            <ion-select-option value="apple">Apple</ion-select-option>
          </ion-select>
        `,
          config
        );

        const select = page.locator('ion-select');
        await expect(select).toHaveScreenshot(screenshot(`select-no-fill-focus`));
      });
    });
    test.describe('input: solid', () => {
      test('should render valid state correctly', async ({ page }) => {
        await page.setContent(
          `
          <ion-select fill="solid" value="apple" class="ion-valid ion-focused" label="Favorite Fruit">
            <ion-select-option value="apple">Apple</ion-select-option>
          </ion-select>
        `,
          config
        );

        const select = page.locator('ion-select');
        await expect(select).toHaveScreenshot(screenshot(`select-solid-valid`));
      });
      test('should render invalid state correctly', async ({ page }) => {
        await page.setContent(
          `
          <ion-select fill="solid" value="apple" class="ion-touched ion-invalid" label="Favorite Fruit">
            <ion-select-option value="apple">Apple</ion-select-option>
          </ion-select>
        `,
          config
        );

        const select = page.locator('ion-select');
        await expect(select).toHaveScreenshot(screenshot(`select-solid-invalid`));
      });
      test('should render focused state correctly', async ({ page }) => {
        await page.setContent(
          `
          <ion-select fill="solid" value="apple" class="ion-focused" label="Favorite Fruit">
            <ion-select-option value="apple">Apple</ion-select-option>
          </ion-select>
        `,
          config
        );

        const select = page.locator('ion-select');
        await expect(select).toHaveScreenshot(screenshot(`select-solid-focus`));
      });
    });
    test.describe('input: outline', () => {
      test('should render valid state correctly', async ({ page }) => {
        await page.setContent(
          `
          <ion-select fill="outline" value="apple" class="ion-valid ion-focused" label="Favorite Fruit">
            <ion-select-option value="apple">Apple</ion-select-option>
          </ion-select>
        `,
          config
        );

        const select = page.locator('ion-select');
        await expect(select).toHaveScreenshot(screenshot(`select-outline-valid`));
      });
      test('should render invalid state correctly', async ({ page }) => {
        await page.setContent(
          `
          <ion-select fill="outline" value="apple" class="ion-touched ion-invalid ion-focused" label="Favorite Fruit">
            <ion-select-option value="apple">Apple</ion-select-option>
          </ion-select>
        `,
          config
        );

        const select = page.locator('ion-select');
        await expect(select).toHaveScreenshot(screenshot(`select-outline-invalid`));
      });
      test('should render focused state correctly', async ({ page }) => {
        await page.setContent(
          `
          <ion-select fill="outline" value="apple" class="ion-focused" label="Favorite Fruit">
            <ion-select-option value="apple">Apple</ion-select-option>
          </ion-select>
        `,
          config
        );

        const select = page.locator('ion-select');
        await expect(select).toHaveScreenshot(screenshot(`select-outline-focus`));
      });
    });
  });

  test.describe(title('select: expanded highlight'), () => {
    test.describe('select: no fill', () => {
      test('should render bottom highlight', async ({ page }) => {
        await page.setContent(
          `
          <ion-select label="Label" class="select-expanded"></ion-select>
        `,
          config
        );

        const select = page.locator('ion-select');
        expect(await select.screenshot({ animations: 'disabled' })).toMatchSnapshot(
          screenshot(`select-no-fill-highlight`)
        );
      });
    });
    test.describe('select: solid', () => {
      test('should render bottom highlight', async ({ page }) => {
        await page.setContent(
          `
          <ion-select fill="solid" label="Label" class="select-expanded"></ion-select>
        `,
          config
        );

        const select = page.locator('ion-select');
        expect(await select.screenshot({ animations: 'disabled' })).toMatchSnapshot(
          screenshot(`select-solid-highlight`)
        );
      });
    });
    test.describe('select: outline', () => {
      test('should render bottom highlight', async ({ page }) => {
        await page.setContent(
          `
          <ion-select fill="outline" label="Label" class="select-expanded"></ion-select>
        `,
          config
        );

        const select = page.locator('ion-select');
        expect(await select.screenshot({ animations: 'disabled' })).toMatchSnapshot(
          screenshot(`select-outline-highlight`)
        );
      });
    });
  });
});
