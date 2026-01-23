import { expect } from '@playwright/test';
import type { E2EPage, E2ELocator, EventSpy, E2EPageOptions, ScreenshotFn } from '@utils/test/playwright';

import type { SelectModalOption } from '../select-modal-interface';

export class SelectModalPage {
  private page: E2EPage;
  private multiple?: boolean;
  private options: SelectModalOption[] = [];

  // Locators
  modal!: E2ELocator;
  selectModal!: E2ELocator;

  // Event spies
  ionModalDidDismiss!: EventSpy;

  constructor(page: E2EPage) {
    this.page = page;
  }

  async setup(config: E2EPageOptions, options: SelectModalOption[], multiple = false) {
    const { page } = this;

    await page.setContent(
      `
    <ion-modal>
      <ion-select-modal></ion-select-modal>
    </ion-modal>
    <script>
      const selectModal = document.querySelector('ion-select-modal');
      selectModal.options = ${JSON.stringify(options)};
      selectModal.multiple = ${multiple};
    </script>
    `,
      config
    );

    const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');
    this.ionModalDidDismiss = await page.spyOnEvent('ionModalDidDismiss');

    this.modal = page.locator('ion-modal');
    this.selectModal = page.locator('ion-select-modal');
    this.multiple = multiple;
    this.options = options;

    await this.modal.evaluate((modal: HTMLIonModalElement) => modal.present());

    await ionModalDidPresent.next();
  }

  async screenshot(screenshot: ScreenshotFn, name: string) {
    await expect(this.selectModal).toHaveScreenshot(screenshot(name));
  }

  async clickOption(value: string) {
    const option = this.getOption(value);
    await option.click();
  }

  async pressSpaceOnOption(value: string) {
    const option = this.getOption(value);
    await option.press('Space');
  }

  private getOption(value: string) {
    const { multiple, selectModal } = this;
    const selector = multiple ? 'ion-checkbox' : 'ion-radio';
    const index = this.options.findIndex((o) => o.value === value);

    return selectModal.locator(selector).nth(index);
  }
}
