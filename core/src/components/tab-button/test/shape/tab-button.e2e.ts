import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';
import type { E2EPage, E2EPageOptions, ScreenshotFn } from '@utils/test/playwright';

class TabButtonFixture {
  readonly page: E2EPage;

  constructor(page: E2EPage) {
    this.page = page;
  }

  async goto(config: E2EPageOptions) {
    const { page } = this;
    await page.goto(`/src/components/tab-button/test/shape`, config);
  }

  async screenshot(screenshotModifier: string, screenshot: ScreenshotFn, buttonId: string) {
    const { page } = this;

    const screenshotString = screenshot(`tab-button-${screenshotModifier}`);
    const tabButton = page.locator(buttonId);

    await expect(tabButton).toHaveScreenshot(screenshotString);
  }
}

/**
 * This behavior does not vary across directions.
 */
configs({ modes: ['ionic-md'], directions: ['ltr'] }).forEach(({ config, screenshot, title }) => {
  test.describe(title('tab-button: shape'), () => {
    let tabButtonFixture: TabButtonFixture;

    test.beforeEach(async ({ page }) => {
      tabButtonFixture = new TabButtonFixture(page);
      await tabButtonFixture.goto(config);
    });

    test('should render the default tab button', async () => {
      await tabButtonFixture.screenshot('shape-round', screenshot, '#default-tab-button');
    });

    test('should render a soft tab button', async () => {
      await tabButtonFixture.screenshot('shape-soft', screenshot, '#soft-tab-button');
    });

    test('should render a round tab button', async () => {
      await tabButtonFixture.screenshot('shape-round', screenshot, '#round-tab-button');
    });

    test('should render a rectangular tab button', async () => {
      await tabButtonFixture.screenshot('shape-rectangular', screenshot, '#rect-tab-button');
    });
  });
});
