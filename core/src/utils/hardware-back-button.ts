import { BackButtonEvent } from '../interface';

type Handler = () => Promise<any> | void | null;

interface HandlerRegister {
  priority: number;
  handler: Handler;
}

export const startHardwareBackButton = () => {
  const doc = document;

  let busy = false;
  doc.addEventListener('backbutton', () => {
    if (busy) {
      return;
    }

    const handlers: HandlerRegister[] = [];
    const ev: BackButtonEvent = new CustomEvent('ionBackButton', {
      bubbles: false,
      detail: {
        register(priority: number, handler: Handler) {
          handlers.push({ priority, handler });
        }
      }
    });
    doc.dispatchEvent(ev);

    if (handlers.length > 0) {
      let selectedPriority = Number.MIN_SAFE_INTEGER;
      let selectedHandler: Handler | undefined;
      handlers.forEach(({ priority, handler }) => {
        if (priority >= selectedPriority) {
          selectedPriority = priority;
          selectedHandler = handler;
        }
      });

      busy = true;
      executeAction(selectedHandler).then(() => busy = false);
    }
  });
};

const executeAction = async (handler: Handler | undefined) => {
  try {
    if (handler) {
      const result = handler();
      if (result != null) {
        await result;
      }
    }
  } catch (e) {
    console.error(e);
  }
};
