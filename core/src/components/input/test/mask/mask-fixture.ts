import { expect } from '@playwright/test';
import type { E2ELocator, E2EPage, TestConfig } from '@utils/test/playwright';
import { test as base } from '@utils/test/playwright';
import type { MaskExpression } from 'src/interface';

const stringifyMask = (mask: MaskExpression | string): string => {
  if (typeof mask === 'string') {
    return `'${mask}'`;
  }
  if (Array.isArray(mask)) {
    return `[${mask.map(stringifyMask).join(', ')}]`;
  }
  return mask.toString();
};

class MaskPage {
  ionInput!: E2ELocator;
  nativeInput!: E2ELocator;

  constructor(private page: E2EPage) {}

  async init(config: TestConfig, mask: MaskExpression | string) {
    await this.page.setContent(
      `<ion-input></ion-input>
      <script>
        const input = document.querySelector('ion-input');
        input.mask = ${stringifyMask(mask)};
      </script>
    `,
      config
    );

    this.ionInput = this.page.locator('ion-input');
    this.nativeInput = this.page.locator('ion-input input');
  }

  async typeAndBlur(value: string) {
    await this.ionInput.click();

    await this.ionInput.type(value, { delay: 50 });
    await this.ionInput.blur();
  }

  async expectValue(value: string) {
    expect(await this.ionInput.evaluate((node: HTMLIonInputElement) => node.value)).toBe(value);
  }
}

type MaskFixtures = {
  maskPage: MaskPage;
};

export const test = base.extend<MaskFixtures>({
  maskPage: async ({ page }, use) => {
    await use(new MaskPage(page));
  },
});
