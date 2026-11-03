import { newSpecPage } from '@stencil/core/testing';
import { win } from '@utils/browser';

import { Footer } from '../footer';

describe('ion-footer: keyboard', () => {
  it('should keep the safe area padding until the webview resizes when the keyboard opens', async () => {
    let appHeight = 800;
    let resizeObserverCallback: (() => void) | undefined;

    const page = await newSpecPage({
      components: [Footer],
      html: '',
    });

    // newSpecPage resets the window, so the globals are mocked afterwards.
    (win as any).Capacitor = {
      isPluginAvailable: () => true,
      Plugins: {
        Keyboard: {
          getResizeMode: () => Promise.resolve({ mode: 'ionic' }),
        },
      },
    };
    Object.defineProperty(globalThis, 'ResizeObserver', {
      configurable: true,
      writable: true,
      value: class {
        constructor(callback: () => void) {
          resizeObserverCallback = callback;
        }
        observe() {}
        disconnect() {}
      },
    });

    await page.setContent(`<ion-app><ion-footer></ion-footer></ion-app>`);

    const app = page.body.querySelector('ion-app')!;
    Object.defineProperty(Object.getPrototypeOf(app), 'clientHeight', { get: () => appHeight, configurable: true });

    const footer = page.body.querySelector('ion-footer')!;
    expect(footer).toHaveClass('footer-toolbar-padding');

    win!.dispatchEvent(new Event('keyboardWillShow'));
    await page.waitForChanges();

    expect(footer).toHaveClass('footer-toolbar-padding');

    appHeight = 500;
    resizeObserverCallback!();
    await Promise.resolve();
    await page.waitForChanges();

    expect(footer).not.toHaveClass('footer-toolbar-padding');
  });
});
