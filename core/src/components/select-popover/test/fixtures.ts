import type { E2EPage, E2ELocator } from '@utils/test/playwright';

import type { SelectPopoverOption } from '../select-popover-interface';

export class SelectPopoverPage {
  private page: E2EPage;
  private multiple?: boolean;
  private options: SelectPopoverOption[] = [];

  popover!: E2ELocator;
  selectPopover!: E2ELocator;

  constructor(page: E2EPage) {
    this.page = page;
  }

  async setup(options: SelectPopoverOption[], multiple = false) {
    const { page } = this;

    await page.setContent(`
    <ion-popover>
      <ion-select-popover></ion-select-popover>
    </ion-popover>
    `);

    const ionPopoverDidPresent = await page.spyOnEvent('ionPopoverDidPresent');

    await page.evaluate(
      ({ options, multiple }) => {
        const selectPopover = document.querySelector('ion-select-popover')!;
        selectPopover.options = options;
        selectPopover.multiple = multiple;
      },
      { options, multiple }
    );

    this.popover = await page.locator('ion-popover');
    this.selectPopover = await page.locator('ion-select-popover');
    this.multiple = multiple;
    this.options = options;

    await this.popover.evaluate((popover: HTMLIonPopoverElement) => popover.present());

    await ionPopoverDidPresent.next();
  }

  async updateOptions(options: SelectPopoverOption[]) {
    const { page } = this;
    await page.evaluate((options) => {
      const selectPopover = document.querySelector('ion-select-popover')!;
      selectPopover.options = options;
    }, options);

    await page.waitForChanges();

    this.options = options;
  }

  async clickOption(value: string) {
    const option = this.getOption(value);
    await option.click();
  }

  async pressEnterOnOption(value: string) {
    const option = this.getOption(value);
    await option.press('Enter');
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
