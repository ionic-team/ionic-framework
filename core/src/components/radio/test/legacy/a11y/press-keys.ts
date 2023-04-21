import type { Browser, BrowserContext, Page } from '@playwright/test';

const SHIFT = 'shift';
const CTRL = 'ctrl';
const ALT = 'alt';
const COMMAND = 'meta';

let clipboardDataHolder: {
  plainText: string;
  html: string;
} = {
  plainText: '',
  html: '',
};

export class PageUtils {
  browser: Browser;
  page: Page;
  context: BrowserContext;

  constructor({ page }: any) {
    this.page = page;
    this.context = page.context();
    this.browser = this.context.browser()!;
  }

  pressKeys: typeof pressKeys = pressKeys.bind(this);
}

const baseModifiers = {
  primary: (_isApple: any) => (_isApple() ? [COMMAND] : [CTRL]),
  primaryShift: (_isApple: any) => (_isApple() ? [SHIFT, COMMAND] : [CTRL, SHIFT]),
  primaryAlt: (_isApple: any) => (_isApple() ? [ALT, COMMAND] : [CTRL, ALT]),
  secondary: (_isApple: any) => (_isApple() ? [SHIFT, ALT, COMMAND] : [CTRL, SHIFT, ALT]),
  access: (_isApple: any) => (_isApple() ? [CTRL, ALT] : [SHIFT, ALT]),
  ctrl: () => [CTRL],
  alt: () => [ALT],
  ctrlShift: () => [CTRL, SHIFT],
  shift: () => [SHIFT],
  shiftAlt: () => [SHIFT, ALT],
  undefined: () => [],
};

async function emulateClipboard(page: Page, type: 'copy' | 'cut' | 'paste') {
  clipboardDataHolder = await page.evaluate(
    ([_type, _clipboardData]) => {
      const clipboardDataTransfer = new DataTransfer();

      if (_type === 'paste') {
        clipboardDataTransfer.setData('text/plain', _clipboardData.plainText);
        clipboardDataTransfer.setData('text/html', _clipboardData.html);
      } else {
        const selection = window.getSelection()!;
        const plainText = selection.toString();
        let html = plainText;
        if (selection.rangeCount) {
          const range = selection.getRangeAt(0);
          const fragment = range.cloneContents();
          html = Array.from(fragment.childNodes)
            .map((node) => (node as Element).outerHTML ?? node.nodeValue)
            .join('');
        }
        clipboardDataTransfer.setData('text/plain', plainText);
        clipboardDataTransfer.setData('text/html', html);
      }

      document.activeElement?.dispatchEvent(
        new ClipboardEvent(_type, {
          bubbles: true,
          cancelable: true,
          clipboardData: clipboardDataTransfer,
        })
      );

      return {
        plainText: clipboardDataTransfer.getData('text/plain'),
        html: clipboardDataTransfer.getData('text/html'),
      };
    },
    [type, clipboardDataHolder] as const
  );
}

const isAppleOS = () => process.platform === 'darwin';

const isWebkit = (page: Page) => page.context().browser()!.browserType().name() === 'webkit';

const browserCache = new WeakMap();
const getHasNaturalTabNavigation = async (page: Page) => {
  if (!isAppleOS() || !isWebkit(page)) {
    return true;
  }
  if (browserCache.has(page.context().browser()!)) {
    return browserCache.get(page.context().browser()!);
  }
  const testPage = await page.context().newPage();
  await testPage.setContent(`<button>1</button><button>2</button>`);
  await testPage.getByText('1').focus();
  await testPage.keyboard.press('Tab');
  const featureDetected = await testPage.getByText('2').evaluate((node) => node === document.activeElement);
  browserCache.set(page.context().browser()!, featureDetected);
  await testPage.close();
  return featureDetected;
};

type Options = {
  times?: number;
  delay?: number;
};

const modifiers = {
  ...baseModifiers,
  shiftAlt: (_isApple: () => boolean) => (_isApple() ? [SHIFT, ALT] : [SHIFT, CTRL]),
};

export async function pressKeys(this: PageUtils, key: string, { times, ...pressOptions }: Options = {}) {
  const hasNaturalTabNavigation = await getHasNaturalTabNavigation(this.page);

  let command: () => Promise<void>;

  if (key.toLowerCase() === 'primary+c') {
    command = () => emulateClipboard(this.page, 'copy');
  } else if (key.toLowerCase() === 'primary+x') {
    command = () => emulateClipboard(this.page, 'cut');
  } else if (key.toLowerCase() === 'primary+v') {
    command = () => emulateClipboard(this.page, 'paste');
  } else {
    const keys = key.split('+').flatMap((keyCode) => {
      if (Object.prototype.hasOwnProperty.call(modifiers, keyCode)) {
        return modifiers[keyCode as keyof typeof modifiers](isAppleOS).map((modifier: any) =>
          modifier === CTRL ? 'Control' : capitalCase(modifier)
        );
      } else if (keyCode === 'Tab' && !hasNaturalTabNavigation) {
        return ['Alt', 'Tab'];
      }
      return keyCode;
    });
    const normalizedKeys = keys.join('+');
    command = () => this.page.keyboard.press(normalizedKeys);
  }

  times = times ?? 1;
  for (let i = 0; i < times; i += 1) {
    await command();

    if (times > 1 && pressOptions.delay !== undefined) {
      await this.page.waitForTimeout(pressOptions.delay);
    }
  }
}

// Function to convert a string to capital case
function capitalCase(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
