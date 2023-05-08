import { expect } from '@playwright/test';
import type { Locator } from '@playwright/test';
import { KeyboardResize } from '@utils/native/keyboard';
import type { E2EPage, E2EPageOptions } from '@utils/test/playwright';
import { configs, test } from '@utils/test/playwright';

const getScrollPosition = async (contentEl: Locator) => {
  return await contentEl.evaluate(async (el: HTMLIonContentElement) => {
    const scrollEl = await el.getScrollElement();

    return scrollEl.scrollTop;
  });
};

// TODO FW-3427
configs({ modes: ['ios'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe.skip(title('scroll-assist'), () => {
    let scrollAssistFixture: ScrollAssistFixture;
    test.beforeEach(async ({ page, skip }) => {
      test.slow();
      skip.browser('firefox');
      skip.browser('chromium');

      scrollAssistFixture = new ScrollAssistFixture(page);
    });

    test.describe('scroll-assist: basic functionality', () => {
      test.beforeEach(async () => {
        await scrollAssistFixture.goto(config);
      });
      test('should not activate when input is above the keyboard', async () => {
        await scrollAssistFixture.expectNotToHaveScrollAssist(
          '#input-above-keyboard',
          '#input-above-keyboard input:not(.cloned-input)'
        );
      });

      test('should activate when input is below the keyboard', async () => {
        await scrollAssistFixture.expectToHaveScrollAssist(
          '#input-below-keyboard',
          '#input-below-keyboard input:not(.cloned-input)'
        );
      });

      test('should activate even when not explicitly tapping input', async () => {
        await scrollAssistFixture.expectToHaveScrollAssist(
          '#item-below-keyboard ion-label',
          '#input-below-keyboard input:not(.cloned-input)'
        );
      });
    });
    test.describe('scroll-assist: scroll-padding', () => {
      test.describe('scroll-padding: browser/cordova', () => {
        test.beforeEach(async () => {
          await scrollAssistFixture.goto(config);
        });
        test('should add scroll padding for an input at the bottom of the scroll container', async () => {
          await scrollAssistFixture.expectToHaveScrollPadding(
            '#input-outside-viewport',
            '#input-outside-viewport input:not(.cloned-input)'
          );
        });

        test('should keep scroll padding even when switching between inputs', async () => {
          await scrollAssistFixture.expectToHaveScrollPadding(
            '#input-outside-viewport',
            '#input-outside-viewport input:not(.cloned-input)'
          );

          await scrollAssistFixture.expectToHaveScrollPadding(
            '#textarea-outside-viewport',
            '#textarea-outside-viewport textarea:not(.cloned-input)'
          );
        });
      });
      test.describe('scroll-padding: webview resizing', () => {
        test('should add scroll padding when webview resizing is "none"', async () => {
          await scrollAssistFixture.goto(config, KeyboardResize.None);

          await scrollAssistFixture.expectToHaveScrollPadding(
            '#input-outside-viewport',
            '#input-outside-viewport input:not(.cloned-input)'
          );
        });
        test('should not add scroll padding when webview resizing is "body"', async () => {
          await scrollAssistFixture.goto(config, KeyboardResize.Body);

          await scrollAssistFixture.expectNotToHaveScrollPadding(
            '#input-outside-viewport',
            '#input-outside-viewport input:not(.cloned-input)'
          );
        });
        test('should not add scroll padding when webview resizing is "ionic"', async () => {
          await scrollAssistFixture.goto(config, KeyboardResize.Ionic);

          await scrollAssistFixture.expectNotToHaveScrollPadding(
            '#input-outside-viewport',
            '#input-outside-viewport input:not(.cloned-input)'
          );
        });
        test('should not add scroll padding when webview resizing is "native"', async () => {
          await scrollAssistFixture.goto(config, KeyboardResize.Native);

          await scrollAssistFixture.expectNotToHaveScrollPadding(
            '#input-outside-viewport',
            '#input-outside-viewport input:not(.cloned-input)'
          );
        });
      });
    });
  });
});

class ScrollAssistFixture {
  readonly page: E2EPage;
  private content!: Locator;

  constructor(page: E2EPage) {
    this.page = page;
  }

  async goto(config: E2EPageOptions, resizeMode?: KeyboardResize) {
    let url = `/src/utils/input-shims/hacks/test`;
    if (resizeMode !== undefined) {
      url += `?resizeMode=${resizeMode}`;
    }

    await this.page.goto(url, config);

    this.content = this.page.locator('ion-content');
  }

  private async focusInput(interactiveSelector: string, inputSelector: string) {
    const { page } = this;
    const interactive = page.locator(interactiveSelector);
    const input = page.locator(inputSelector);

    await interactive.click({ force: true });
    await expect(input).toBeFocused();
    await page.waitForChanges();
  }

  private getScrollPosition() {
    const { content } = this;

    return getScrollPosition(content);
  }

  async expectNotToHaveScrollAssist(interactiveSelector: string, inputSelector: string) {
    await expect(await this.getScrollPosition()).toBe(0);

    await this.focusInput(interactiveSelector, inputSelector);

    await expect(await this.getScrollPosition()).toBe(0);
  }

  async expectToHaveScrollAssist(interactiveSelector: string, inputSelector: string) {
    await expect(await this.getScrollPosition()).toBe(0);

    await this.focusInput(interactiveSelector, inputSelector);

    await expect(await this.getScrollPosition()).not.toBe(0);
  }

  async expectToHaveScrollPadding(interactiveSelector: string, inputSelector: string) {
    const { content } = this;

    await this.focusInput(interactiveSelector, inputSelector);

    await expect(content).not.toHaveCSS('--keyboard-offset', '0px');
  }

  async expectNotToHaveScrollPadding(interactiveSelector: string, inputSelector: string) {
    const { content } = this;

    await this.focusInput(interactiveSelector, inputSelector);

    await expect(content).toHaveCSS('--keyboard-offset', '0px');
  }
}
