import type { Locator } from '@playwright/test';
import { expect } from '@playwright/test';
import type { E2EPage } from '@utils/test/playwright';

export class RadioFixture {
  readonly page: E2EPage;

  private radio!: Locator;

  constructor(page: E2EPage) {
    this.page = page;
  }

  async checkRadio(
    method: 'keyboard' | 'mouse',
    selector = 'ion-radio'
  ) {
    const { page } = this;
    const radio = (this.radio =
      page.locator(selector));

    if (method === 'keyboard') {
      await radio.focus();
      await page.keyboard.press(
        'Space'
      );
    } else {
      await radio.click();
    }

    await page.waitForChanges();

    return radio;
  }

  async expectChecked(state: boolean) {
    const { radio } = this;

    if (state) {
      await expect(radio).toHaveClass(
        /radio-checked/
      );
    } else {
      await expect(
        radio
      ).not.toHaveClass(
        /radio-checked/
      );
    }
  }
}
