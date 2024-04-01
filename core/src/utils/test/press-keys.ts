import type {
  Browser,
  BrowserContext,
  Page,
} from '@playwright/test';

/**
 * The purpose of this utility is to provide a way to press keys in a way that
 * is consistent across browsers and platforms. Playwright does not automatically
 * normalize key presses, so we need to do it ourselves.
 *
 * In certain environments, such as Webkit on macOS, the browser will not focus
 * the correct element in the DOM when the tab key is pressed.
 * This utility will detect if the browser has natural tab navigation and
 * will use the appropriate key combination to simulate a tab press.
 * The utility will normalize key presses for other combinations as well.
 */

const SHIFT = 'shift';
const CTRL = 'ctrl';
const ALT = 'alt';
const COMMAND = 'meta';

/**
 * Source: https://github.com/WordPress/gutenberg/blob/f0d0d569a06c42833670c9b5285d04a63968a220/packages/e2e-test-utils-playwright/src/page-utils/press-keys.ts
 * Slimmed down version of WordPress' pressKeys utility.
 */
export class PageUtils {
  browser: Browser;
  page: Page;
  context: BrowserContext;

  constructor({
    page,
  }: {
    page: Page;
  }) {
    this.page = page;
    this.context = page.context();
    this.browser =
      this.context.browser()!;
  }

  pressKeys: typeof pressKeys =
    pressKeys.bind(this);
}

const baseModifiers = {
  primary: (_isApple: any) =>
    _isApple() ? [COMMAND] : [CTRL],
  primaryShift: (_isApple: any) =>
    _isApple()
      ? [SHIFT, COMMAND]
      : [CTRL, SHIFT],
  primaryAlt: (_isApple: any) =>
    _isApple()
      ? [ALT, COMMAND]
      : [CTRL, ALT],
  secondary: (_isApple: any) =>
    _isApple()
      ? [SHIFT, ALT, COMMAND]
      : [CTRL, SHIFT, ALT],
  access: (_isApple: any) =>
    _isApple()
      ? [CTRL, ALT]
      : [SHIFT, ALT],
  ctrl: () => [CTRL],
  alt: () => [ALT],
  ctrlShift: () => [CTRL, SHIFT],
  shift: () => [SHIFT],
  shiftAlt: () => [SHIFT, ALT],
  undefined: () => [],
};

const isAppleOS = () =>
  process.platform === 'darwin';
const isWebkit = (page: Page) =>
  page
    .context()
    .browser()!
    .browserType()
    .name() === 'webkit';
const browserCache = new WeakMap();

/**
 * Detects if the browser has natural tab navigation.
 * Natural tab navigation means that the browser will focus the next element
 * in the DOM when the tab key is pressed.
 */
const getHasNaturalTabNavigation =
  async (page: Page) => {
    if (
      !isAppleOS() ||
      !isWebkit(page)
    ) {
      return true;
    }
    if (
      browserCache.has(
        page.context().browser()!
      )
    ) {
      return browserCache.get(
        page.context().browser()!
      );
    }
    const testPage = await page
      .context()
      .newPage();
    await testPage.setContent(
      `<button>1</button><button>2</button>`
    );
    await testPage
      .getByText('1')
      .focus();
    await testPage.keyboard.press(
      'Tab'
    );
    const featureDetected =
      await testPage
        .getByText('2')
        .evaluate(
          (node) =>
            node ===
            document.activeElement
        );
    browserCache.set(
      page.context().browser()!,
      featureDetected
    );
    await testPage.close();
    return featureDetected;
  };

type Options = {
  /**
   * Number of times to press the key.
   */
  times?: number;
  /**
   * Delay between each key press in milliseconds.
   */
  delay?: number;
};

const modifiers = {
  ...baseModifiers,
  shiftAlt: (_isApple: () => boolean) =>
    _isApple()
      ? [SHIFT, ALT]
      : [SHIFT, CTRL],
};

/**
 * Presses a key combination.
 * @param key - Key combination to press.
 * @param options - Options for the key press.
 * @example
 * ```ts
 * await pressKeys('a');
 * await pressKeys('a', { times: 2 });
 * await pressKeys('a', { delay: 100 });
 * await pressKeys('Shift+Tab');
 * ```
 */
export async function pressKeys(
  this: PageUtils,
  key: string,
  {
    times,
    ...pressOptions
  }: Options = {}
) {
  const hasNaturalTabNavigation =
    await getHasNaturalTabNavigation(
      this.page
    );
  /**
   * Split the key combination into individual keys and map each key to its
   * corresponding modifier.
   */
  const keys = key
    .split('+')
    .flatMap((keyCode) => {
      /**
       * If the key is a modifier, we need to map it to the correct modifier for
       * the current platform.
       */
      if (keyCode in modifiers) {
        return modifiers[
          keyCode as keyof typeof modifiers
        ](isAppleOS).map((modifier) =>
          modifier === CTRL
            ? 'Control'
            : capitalCase(modifier)
        );
      } else if (
        keyCode === 'Tab' &&
        !hasNaturalTabNavigation
      ) {
        /**
         * If the key is the tab key and the browser does not have natural tab
         * navigation, we need to simulate the tab key press by pressing the Alt key
         * and the Tab key.
         */
        return ['Alt', 'Tab'];
      }
      // If the key is not a modifier, we can just return the key.
      return keyCode;
    });
  const normalizedKeys = keys.join('+');
  const command = () =>
    this.page.keyboard.press(
      normalizedKeys
    );

  times = times ?? 1;
  for (let i = 0; i < times; i += 1) {
    await command();

    if (
      times > 1 &&
      pressOptions.delay !== undefined
    ) {
      /**
       * If we are pressing the key multiple times, we need to wait for the
       * delay between each key press.
       */
      await this.page.waitForTimeout(
        pressOptions.delay
      );
    }
  }
}

/**
 * Capitalizes the first letter of a string.
 */
function capitalCase(string: string) {
  return (
    string.charAt(0).toUpperCase() +
    string.slice(1)
  );
}
