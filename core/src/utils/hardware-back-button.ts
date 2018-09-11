import { BackButtonEvent } from '../interface';

type Handler = () => Promise<any> | void | null;

interface HandlerRegister {
  priority: number;
  handler: Handler;
}

export function startHardwareBackButton(win: Window) {
  let busy = false;
  win.addEventListener('backbutton', () => {
    if (busy) {
      return;
    }
    busy = true;
    const handlers: HandlerRegister[] = [];
    const ev: BackButtonEvent = new CustomEvent('ionBackButton', {
      bubbles: false,
      detail: {
        register(priority: number, handler: Handler) {
          handlers.push({ priority, handler });
        }
      }
    });
    win.document.body.dispatchEvent(ev);

    if (handlers.length > 0) {
      let selectedPriority = Number.MIN_SAFE_INTEGER;
      let handler: Handler;
      handlers.forEach(h => {
        if (h.priority >= selectedPriority) {
          selectedPriority = h.priority;
          handler = h.handler;
        }
      });
      const result = handler!();
      if (result != null) {
        // tslint:disable-next-line:no-floating-promises
        result.then(() => busy = false);
      }
    }
  });
}
