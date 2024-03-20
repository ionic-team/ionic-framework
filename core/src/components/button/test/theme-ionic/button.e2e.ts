import { expect } from '@playwright/test';
import type { E2EPage } from '@utils/test/playwright';
import { configs, test } from '@utils/test/playwright';

class ButtonFixture {
  readonly page: E2EPage;
  readonly screenshotFn?: (file: string) => string;

  constructor(page: E2EPage, screenshot?: (file: string) => string) {
    this.page = page;
    this.screenshotFn = screenshot;
  }

  async selectOption(select: string, optIndex: number) {
    const selectElem = this.page.locator(`ion-select#select-${select}`);
    await selectElem.click();

    const selectOptElem = this.page.locator(`ion-alert .alert-radio-group button:nth-child(${optIndex + 1})`);
    await selectOptElem.click();

    const selectOkBtn = this.page.locator(`ion-alert .alert-button-group button:nth-child(2)`);
    await selectOkBtn.click();
  }

  async checkScreenshot(modifier: string) {
    const { screenshotFn } = this;

    if (!screenshotFn) {
      throw new Error(
        'A screenshot function is required to take a screenshot. Pass one in when creating ButtonFixture.'
      );
    }

    await expect(this.page).toHaveScreenshot(screenshotFn(`${modifier}-button`));
  }
}

configs({ themes: ['ionic'] }).forEach(({ config, screenshot, title }) => {
  test.describe(title('button: theme ionic'), () => {
    let buttonFixture!: ButtonFixture;

    test.beforeEach(async ({ page }) => {
      await page.goto(`/src/components/button/test/theme-ionic`, config);
      await page.setIonViewport();
      buttonFixture = new ButtonFixture(page, screenshot);
    });

    test('default', async () => {
      await buttonFixture.checkScreenshot(`default`);
    });

    test('check sizes', async () => {
      await buttonFixture.selectOption('size', 1);
      await buttonFixture.checkScreenshot(`xsmall`);

      await buttonFixture.selectOption('size', 2);
      await buttonFixture.checkScreenshot(`small`);

      await buttonFixture.selectOption('size', 3);
      await buttonFixture.checkScreenshot(`large`);

      await buttonFixture.selectOption('size', 4);
      await buttonFixture.checkScreenshot(`xlarge`);
    });

    test('check shapes', async () => {
      await buttonFixture.selectOption('shape', 1);
      await buttonFixture.checkScreenshot(`rectangular`);

      await buttonFixture.selectOption('shape', 2);
      await buttonFixture.checkScreenshot(`round`);
    });

    test('check fills', async () => {
      await buttonFixture.selectOption('fill', 1);
      await buttonFixture.checkScreenshot(`outline`);

      await buttonFixture.selectOption('fill', 2);
      await buttonFixture.checkScreenshot(`clear`);
    });
  });
});
