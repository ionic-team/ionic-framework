import type { Locator } from '@playwright/test';
import { expect } from '@playwright/test';
import type { E2EPage } from '@utils/test/playwright';

interface CheckRadioKeyboardOptions {
  method: 'keyboard';
  key: 'Space' | 'Enter';
  selector?: string;
}

interface CheckRadioMouseOptions {
  method: 'mouse';
  selector?: string;
}

type CheckRadioOptions = CheckRadioKeyboardOptions | CheckRadioMouseOptions;

export class RadioFixture {
  readonly page: E2EPage;

  private radio!: Locator;

  constructor(page: E2EPage) {
    this.page = page;
  }

  async checkRadio(options: CheckRadioOptions) {
    const { page } = this;
    const selector = options.selector ?? 'ion-radio';
    const radio = (this.radio = page.locator(selector));

    if (options.method === 'keyboard') {
      await radio.focus();
      await page.keyboard.press(options.key);
    } else {
      await radio.click();
    }

    await page.waitForChanges();

    return radio;
  }

  async expectChecked(state: boolean) {
    const { radio } = this;

    if (state) {
      await expect(radio).toHaveClass(/radio-checked/);
    } else {
      await expect(radio).not.toHaveClass(/radio-checked/);
    }
  }
}
