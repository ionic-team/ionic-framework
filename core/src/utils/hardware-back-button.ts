import { win } from '@utils/browser';
import type { CloseWatcher } from '@utils/browser';
import { printIonError } from '@utils/logging';

import { config } from '../global/config';

// TODO(FW-2832): type
type Handler = (processNextHandler: () => void) => Promise<any> | void | null;

export interface BackButtonEventDetail {
  register(priority: number, handler: (processNextHandler: () => void) => Promise<any> | void): void;
}

export type BackButtonEvent = CustomEvent<BackButtonEventDetail>;

interface HandlerRegister {
  priority: number;
  handler: Handler;
  id: number;
}

/**
 * CloseWatcher is a newer API that lets
 * use detect the hardware back button event
 * in a web browser: https://caniuse.com/?search=closewatcher
 * However, not every browser supports it yet.
 *
 * This needs to be a function so that we can
 * check the config once it has been set.
 * Otherwise, this code would be evaluated the
 * moment this file is evaluated which could be
 * before the config is set.
 */
export const shouldUseCloseWatcher = () =>
  config.get('experimentalCloseWatcher', false) && win !== undefined && 'CloseWatcher' in win;

/**
 * When hardwareBackButton: false in config,
 * we need to make sure we also block the default
 * webview behavior. If we don't then it will be
 * possible for users to navigate backward while
 * an overlay is still open. Additionally, it will
 * give the appearance that the hardwareBackButton
 * config is not working as the page transition
 * will still happen.
 */
export const blockHardwareBackButton = () => {
  document.addEventListener('backbutton', () => {});
};

const closeWatcherConditions: (() => boolean)[] = [];
let syncCloseWatcher: (() => void) | undefined;

/**
 * Registers a check for whether the back button
 * has something to close. The CloseWatcher is only
 * active while one of these checks passes.
 */
export const addCloseWatcherCondition = (condition: () => boolean) => {
  closeWatcherConditions.push(condition);
};

/**
 * Call this whenever something the back button
 * can close opens or closes.
 */
export const updateCloseWatcher = () => {
  syncCloseWatcher?.();
};

export const startHardwareBackButton = () => {
  const doc = document;
  let busy = false;

  const backButtonCallback = () => {
    if (busy) {
      return;
    }

    let index = 0;
    let handlers: HandlerRegister[] = [];
    const ev: BackButtonEvent = new CustomEvent('ionBackButton', {
      bubbles: false,
      detail: {
        register(priority: number, handler: Handler) {
          handlers.push({ priority, handler, id: index++ });
        },
      },
    });
    doc.dispatchEvent(ev);

    const executeAction = async (handlerRegister: HandlerRegister | undefined) => {
      try {
        if (handlerRegister?.handler) {
          const result = handlerRegister.handler(processHandlers);
          if (result != null) {
            await result;
          }
        }
      } catch (e) {
        printIonError('[ion-app] - Exception in startHardwareBackButton:', e);
      }
    };

    const processHandlers = () => {
      if (handlers.length > 0) {
        let selectedHandler: HandlerRegister = {
          priority: Number.MIN_SAFE_INTEGER,
          handler: () => undefined,
          id: -1,
        };
        handlers.forEach((handler) => {
          if (handler.priority >= selectedHandler.priority) {
            selectedHandler = handler;
          }
        });

        busy = true;
        handlers = handlers.filter((handler) => handler.id !== selectedHandler.id);
        executeAction(selectedHandler).then(() => (busy = false));
      }
    };

    processHandlers();
  };

  /**
   * Android WebView never sends the hardware back
   * button to a CloseWatcher, so hybrid apps still
   * need this. Browsers never fire backbutton.
   */
  doc.addEventListener('backbutton', backButtonCallback);

  if (shouldUseCloseWatcher()) {
    let watcher: CloseWatcher | undefined;

    /**
     * An active CloseWatcher stops the back button from
     * navigating, so only keep one while there's something to close.
     */
    syncCloseWatcher = () => {
      const canClose = closeWatcherConditions.some((condition) => condition());

      if (!canClose) {
        watcher?.destroy();
        watcher = undefined;
        return;
      }

      if (watcher !== undefined) {
        return;
      }

      watcher = new win!.CloseWatcher!();

      /**
       * Once a close request happens
       * the watcher gets destroyed.
       * As a result, we need to re-configure
       * the watcher so we can respond to other
       * close requests, including after one that
       * closed nothing, like a modal whose canDismiss
       * returned false.
       */
      watcher!.onclose = () => {
        watcher = undefined;
        backButtonCallback();
        syncCloseWatcher?.();
      };
    };

    syncCloseWatcher();
  }
};

export const OVERLAY_BACK_BUTTON_PRIORITY = 100;
export const MENU_BACK_BUTTON_PRIORITY = 99; // 1 less than overlay priority since menu is displayed behind overlays
