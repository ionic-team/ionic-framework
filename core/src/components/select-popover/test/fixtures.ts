import type { E2EPage, E2ELocator, EventSpy } from '@utils/test/playwright';

import type { SelectPopoverOption } from '../select-popover-interface';

export class SelectPopoverPage {
  private page: E2EPage;
  private multiple?: boolean;
  private options: SelectPopoverOption[] = [];

  // Locators
  popover!: E2ELocator;
  selectPopover!: E2ELocator;

  // Event spies
  ionPopoverDidDismiss!: EventSpy;

  constructor(page: E2EPage) {
    this.page = page;
  }

  async setup(options: SelectPopoverOption[], multiple = false) {
    const { page } = this;

    await page.setContent(`
    <ion-popover>
      <ion-select-popover></ion-select-popover>
    </ion-popover>
    <script>
      const selectPopover = document.querySelector('ion-select-popover');
      selectPopover.options = ${JSON.stringify(options)};
      selectPopover.multiple = ${multiple};
    </script>
    `);

    const ionPopoverDidPresent = await page.spyOnEvent('ionPopoverDidPresent');
    this.ionPopoverDidDismiss = await page.spyOnEvent('ionPopoverDidDismiss');

    this.popover = page.locator('ion-popover');
    this.selectPopover = page.locator('ion-select-popover');
    this.multiple = multiple;
    this.options = options;

    await this.popover.evaluate((popover: HTMLIonPopoverElement) => popover.present());

    await ionPopoverDidPresent.next();
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
    const { multiple, selectPopover } = this;
    const selector = multiple ? 'ion-checkbox' : 'ion-radio';
    const index = this.options.findIndex((o) => o.value === value);

    return selectPopover.locator(selector).nth(index);
  }
}
