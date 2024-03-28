import { expect } from '@playwright/test';
import type { E2EPage } from '@utils/test/playwright';
import { configs, test } from '@utils/test/playwright';

class CheckboxFixture {
  readonly page: E2EPage;
  readonly screenshotFn?: (file: string) => string;

  constructor(page: E2EPage, screenshot?: (file: string) => string) {
    this.page = page;
    this.screenshotFn = screenshot;
  }

  async checkScreenshot(modifier: string) {
    const { screenshotFn } = this;

    if (!screenshotFn) {
      throw new Error(
        'A screenshot function is required to take a screenshot. Pass one in when creating CheckboxFixture.'
      );
    }

    const wrapper = this.page.locator('#screenshot-wrapper');

    await expect(wrapper).toHaveScreenshot(screenshotFn(`${modifier}-checkbox`));
  }
}

configs({ themes: ['ionic'], modes: ['md'] }).forEach(({ config, screenshot, title }) => {
  test.describe(title('checkbox: theme ionic'), () => {
    let checkboxFixture!: CheckboxFixture;

    test.beforeEach(async ({ page }) => {
      await page.goto(`/src/components/checkbox/test/theme-ionic`, config);
      await page.setIonViewport();
      checkboxFixture = new CheckboxFixture(page, screenshot);
    });

    test('default', async () => {
      await checkboxFixture.checkScreenshot(`default`);
    });
  });
});
