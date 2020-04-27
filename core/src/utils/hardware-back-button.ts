import { BackButtonEvent } from '../interface';

type Handler = (processNextHandler: () => void) => Promise<any> | void | null;

interface HandlerRegister {
  priority: number;
  handler: Handler;
  id: number;
}

export const startHardwareBackButton = () => {
  const doc = document;

  let busy = false;
  doc.addEventListener('backbutton', () => {
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
        }
      }
    });
    doc.dispatchEvent(ev);

    const executeAction = async (handlerRegister: HandlerRegister | undefined) => {
      try {
        if (handlerRegister && handlerRegister.handler) {
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
          id: -1
        };
        handlers.forEach(handler => {
          if (handler.priority >= selectedHandler.priority) {
            selectedHandler = handler;
          }
        });

        busy = true;
        handlers = handlers.filter(handler => handler.id !== selectedHandler.id);
        executeAction(selectedHandler).then(() => busy = false);
      }
    };

    processHandlers();
  });
};

export const OVERLAY_BACK_BUTTON_PRIORITY = 100;
export const MENU_BACK_BUTTON_PRIORITY = 99; // 1 less than overlay priority since menu is displayed behind overlays
