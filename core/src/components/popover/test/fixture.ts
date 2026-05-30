import { expect } from '@playwright/test';
import type { E2EPage, E2EPageOptions, ScreenshotFn } from '@utils/test/playwright';

export class PopoverFixture {
  readonly page: E2EPage;

  constructor(page: E2EPage) {
    this.page = page;
  }

  async goto(url: string, config: E2EPageOptions) {
    await this.page.goto(url, config);
  }

  async open(selector: string) {
    const { page } = this;

    const ionPopoverDidPresent = await page.spyOnEvent('ionPopoverDidPresent');

    await page.click(selector);

    await ionPopoverDidPresent.next();
  }

  async screenshot(modifier: string, screenshot: ScreenshotFn) {
    const { page } = this;

    await expect(page).toHaveScreenshot(screenshot(`popover-${modifier}`));
  }
}
