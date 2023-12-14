import { win } from '@utils/browser';
import type { CloseWatcher } from '@utils/browser';

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
 */
export const shoudUseCloseWatcher =
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
  document.addEventListener('backbutton', () => {}); // eslint-disable-line
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
        console.error(e);
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
   * If the CloseWatcher is defined then
   * we don't want to also listen for the native
   * backbutton event otherwise we may get duplicate
   * events firing.
   */
  if (shoudUseCloseWatcher) {
    let watcher: CloseWatcher | undefined;

    const configureWatcher = () => {
      watcher?.destroy();
      watcher = new win!.CloseWatcher!();

      /**
       * Once a close request happens
       * the watcher gets destroyed.
       * As a result, we need to re-configure
       * the watcher so we can respond to other
       * close requests.
       */
      watcher!.onclose = () => {
        backButtonCallback();
        configureWatcher();
      };
    };

    configureWatcher();
  } else {
    doc.addEventListener('backbutton', backButtonCallback);
  }
};

export const OVERLAY_BACK_BUTTON_PRIORITY = 100;
export const MENU_BACK_BUTTON_PRIORITY = 99; // 1 less than overlay priority since menu is displayed behind overlays
