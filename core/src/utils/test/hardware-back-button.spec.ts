import { newSpecPage } from '@stencil/core/testing';

import type { BackButtonEvent } from '../../../src/interface';
import { startHardwareBackButton } from '../hardware-back-button';
import { config } from '../../global/config';

describe('Hardware Back Button', () => {
  beforeEach(() => startHardwareBackButton());
  it('should call handler', () => {
    const cbSpy = jest.fn();
    document.addEventListener('ionBackButton', (ev) => {
      (ev as BackButtonEvent).detail.register(0, cbSpy);
    });

    dispatchBackButtonEvent();
    expect(cbSpy).toHaveBeenCalled();
  });

  it('should call handlers in order of priority', () => {
    const cbSpy = jest.fn();
    const cbSpyTwo = jest.fn();
    document.addEventListener('ionBackButton', (ev) => {
      (ev as BackButtonEvent).detail.register(100, cbSpy);
      (ev as BackButtonEvent).detail.register(99, cbSpyTwo);
    });

    dispatchBackButtonEvent();
    expect(cbSpy).toHaveBeenCalled();
    expect(cbSpyTwo).not.toHaveBeenCalled();
  });

  it('should only call last handler to be added for handlers with same priority', () => {
    const cbSpy = jest.fn();
    const cbSpyTwo = jest.fn();
    document.addEventListener('ionBackButton', (ev) => {
      (ev as BackButtonEvent).detail.register(100, cbSpy);
      (ev as BackButtonEvent).detail.register(100, cbSpyTwo);
    });

    dispatchBackButtonEvent();
    expect(cbSpy).not.toHaveBeenCalled();
    expect(cbSpyTwo).toHaveBeenCalled();
  });

  it('should call multiple callbacks', () => {
    const cbSpy = (processNextHandler: () => void) => {
      processNextHandler();
    };
    const cbSpyTwo = jest.fn();
    document.addEventListener('ionBackButton', (ev) => {
      (ev as BackButtonEvent).detail.register(100, cbSpy);
      (ev as BackButtonEvent).detail.register(99, cbSpyTwo);
    });

    dispatchBackButtonEvent();
    expect(cbSpyTwo).toHaveBeenCalled();
  });
});

describe('Experimental Close Watcher', () => {
  test('should not use the Close Watcher API when available', () => {
    const closeWatchers = mockCloseWatcher();

    config.reset({ experimentalCloseWatcher: false });

    startHardwareBackButton();

    expect(closeWatchers.created).toBe(0);
  });

  test('should still handle the native back button event', async () => {
    await newCloseWatcherPage(`<ion-modal></ion-modal>`);

    const cbSpy = jest.fn();
    document.addEventListener('ionBackButton', (ev) => {
      (ev as BackButtonEvent).detail.register(0, cbSpy);
    });

    dispatchBackButtonEvent();

    expect(cbSpy).toHaveBeenCalled();
  });

  // Fixes https://github.com/ionic-team/ionic-framework/issues/29648
  test('should not intercept the back button while nothing is open', async () => {
    const { closeWatchers } = await newCloseWatcherPage(`<ion-modal></ion-modal>`);

    expect(closeWatchers.active()).toBeUndefined();
  });

  test('should not intercept the back button while only a toast is shown', async () => {
    const { page, closeWatchers } = await newCloseWatcherPage(`<ion-toast></ion-toast>`);

    await page.body.querySelector('ion-toast')!.present();

    expect(closeWatchers.active()).toBeUndefined();
  });

  test('should dismiss a presented modal when the back button is pressed', async () => {
    const { page, closeWatchers } = await newCloseWatcherPage(`<ion-modal></ion-modal>`);

    const modal = page.body.querySelector('ion-modal')!;
    await modal.present();

    expect(closeWatchers.active()).toBeDefined();

    const dismissed = modal.onDidDismiss();
    closeWatchers.requestClose();

    await expect(dismissed).resolves.toEqual(expect.objectContaining({ role: 'backdrop' }));
  });

  // Fixes https://github.com/ionic-team/ionic-framework/issues/29648
  test('should stop intercepting the back button once the modal is dismissed', async () => {
    const { page, closeWatchers } = await newCloseWatcherPage(`<ion-modal></ion-modal>`);

    const modal = page.body.querySelector('ion-modal')!;
    await modal.present();
    await modal.dismiss();

    expect(closeWatchers.active()).toBeUndefined();
  });

  test('should stop intercepting the back button when a presented modal is removed without dismissing', async () => {
    const { page, closeWatchers } = await newCloseWatcherPage(`<ion-modal></ion-modal>`);

    const modal = page.body.querySelector('ion-modal')!;
    await modal.present();
    modal.remove();

    expect(closeWatchers.active()).toBeUndefined();
  });

  test('should keep intercepting the back button when a presented modal is moved', async () => {
    const { page, closeWatchers } = await newCloseWatcherPage(`<ion-modal></ion-modal><div id="target"></div>`);

    const modal = page.body.querySelector('ion-modal')!;
    await modal.present();
    page.body.querySelector('#target')!.appendChild(modal);

    expect(closeWatchers.active()).toBeDefined();
  });

  test('should keep intercepting the back button while a modal is still open underneath', async () => {
    const { page, closeWatchers } = await newCloseWatcherPage(`
      <ion-modal id="bottom"></ion-modal>
      <ion-modal id="top"></ion-modal>
    `);

    const bottom = page.body.querySelector<HTMLIonModalElement>('#bottom')!;
    const top = page.body.querySelector<HTMLIonModalElement>('#top')!;
    await bottom.present();
    await top.present();

    const topDismissed = top.onDidDismiss();
    closeWatchers.requestClose();
    await topDismissed;

    const bottomDismissed = bottom.onDidDismiss();
    closeWatchers.requestClose();

    await expect(bottomDismissed).resolves.toEqual(expect.objectContaining({ role: 'backdrop' }));
    expect(closeWatchers.active()).toBeUndefined();
  });

  test('should keep intercepting the back button when the modal refuses to dismiss', async () => {
    const { page, closeWatchers } = await newCloseWatcherPage(`<ion-modal></ion-modal>`);

    const modal = page.body.querySelector('ion-modal')!;
    let dismissAttempts = 0;
    modal.canDismiss = () => {
      dismissAttempts++;
      return Promise.resolve(false);
    };
    await modal.present();

    closeWatchers.requestClose();
    await page.waitForChanges();
    closeWatchers.requestClose();
    await page.waitForChanges();

    expect(dismissAttempts).toBe(2);
  });

  test('should dismiss a modal that allows backdrop dismissal only after it was presented', async () => {
    const { page, closeWatchers } = await newCloseWatcherPage(`<ion-modal></ion-modal>`);

    const modal = page.body.querySelector('ion-modal')!;
    modal.backdropDismiss = false;
    await modal.present();
    modal.backdropDismiss = true;

    const dismissed = modal.onDidDismiss();
    closeWatchers.requestClose();

    await expect(dismissed).resolves.toEqual(expect.objectContaining({ role: 'backdrop' }));
  });

  test('should keep intercepting the back button while a toast is shown over a modal', async () => {
    const { page, closeWatchers } = await newCloseWatcherPage(`
      <ion-modal></ion-modal>
      <ion-toast></ion-toast>
    `);

    await page.body.querySelector('ion-modal')!.present();
    await page.body.querySelector('ion-toast')!.present();

    expect(closeWatchers.active()).toBeDefined();
  });
});

/**
 * Modules are reset first because overlays attach their back button
 * listener once per module load, and every spec page gets a new document.
 */
const newCloseWatcherPage = async (html: string) => {
  jest.resetModules();
  const { Modal } = await import('../../components/modal/modal');
  const { Toast } = await import('../../components/toast/toast');
  const { startHardwareBackButton } = await import('../hardware-back-button');
  const { config } = await import('../../global/config');

  const page = await newSpecPage({ components: [Modal, Toast], html });

  // Install the mock after newSpecPage, which resets the window
  const closeWatchers = mockCloseWatcher();
  config.reset({ experimentalCloseWatcher: true });
  startHardwareBackButton();

  return { page, closeWatchers };
};

/**
 * Like the browser, only the newest watcher that hasn't
 * been destroyed gets close requests.
 */
const mockCloseWatcher = () => {
  const watchers: { destroyed: boolean; onclose: (() => void) | null; destroy: () => void }[] = [];

  (window as any).CloseWatcher = class {
    destroyed = false;
    onclose: (() => void) | null = null;

    constructor() {
      watchers.push(this);
    }

    destroy() {
      this.destroyed = true;
    }
  };

  const active = () => watchers.filter((w) => !w.destroyed).slice(-1)[0];

  return {
    get created() {
      return watchers.length;
    },
    active,
    /**
     * Presses back. Like the browser, this destroys
     * the watcher before firing `close`.
     */
    requestClose() {
      const watcher = active();
      if (watcher) {
        watcher.destroyed = true;
        watcher.onclose?.();
      }
    },
  };
};

const dispatchBackButtonEvent = () => {
  const ev = new Event('backbutton');
  document.dispatchEvent(ev);
};
