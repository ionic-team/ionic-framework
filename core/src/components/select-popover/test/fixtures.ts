import { expect } from '@playwright/test';
import type {
  E2EPage,
  E2ELocator,
  EventSpy,
  E2EPageOptions,
  ScreenshotFn,
} from '@utils/test/playwright';

import type { SelectPopoverOption } from '../select-popover-interface';

export class SelectPopoverPage {
  private page: E2EPage;
  private multiple?: boolean;
  private options: SelectPopoverOption[] =
    [];

  // Locators
  popover!: E2ELocator;
  selectPopover!: E2ELocator;

  // Event spies
  ionPopoverDidDismiss!: EventSpy;

  constructor(page: E2EPage) {
    this.page = page;
  }

  async setup(
    config: E2EPageOptions,
    options: SelectPopoverOption[],
    multiple = false
  ) {
    const { page } = this;

    await page.setContent(
      `
    <ion-popover>
      <ion-select-popover></ion-select-popover>
    </ion-popover>
    <script>
      const selectPopover = document.querySelector('ion-select-popover');
      selectPopover.options = ${JSON.stringify(
        options
      )};
      selectPopover.multiple = ${multiple};
    </script>
    `,
      config
    );

    const ionPopoverDidPresent =
      await page.spyOnEvent(
        'ionPopoverDidPresent'
      );
    this.ionPopoverDidDismiss =
      await page.spyOnEvent(
        'ionPopoverDidDismiss'
      );

    this.popover = page.locator(
      'ion-popover'
    );
    this.selectPopover = page.locator(
      'ion-select-popover'
    );
    this.multiple = multiple;
    this.options = options;

    await this.popover.evaluate(
      (
        popover: HTMLIonPopoverElement
      ) => popover.present()
    );

    await ionPopoverDidPresent.next();
  }

  async screenshot(
    screenshot: ScreenshotFn,
    name: string
  ) {
    await expect(
      this.selectPopover
    ).toHaveScreenshot(
      screenshot(name)
    );
  }

  async clickOption(value: string) {
    const option =
      this.getOption(value);
    await option.click();
  }

  async pressSpaceOnOption(
    value: string
  ) {
    const option =
      this.getOption(value);
    await option.press('Space');
  }

  private getOption(value: string) {
    const { multiple, selectPopover } =
      this;
    const selector = multiple
      ? 'ion-checkbox'
      : 'ion-radio';
    const index =
      this.options.findIndex(
        (o) => o.value === value
      );

    return selectPopover
      .locator(selector)
      .nth(index);
  }
}
