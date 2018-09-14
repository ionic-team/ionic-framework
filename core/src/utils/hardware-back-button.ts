import { BackButtonEvent } from '../interface';

type Handler = () => Promise<any> | void | null;

interface HandlerRegister {
  priority: number;
  handler: Handler;
}

export function startHardwareBackButton(win: Window) {
  let busy = false;
  win.document.addEventListener('backbutton', () => {
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
    win.document.dispatchEvent(ev);

    if (handlers.length > 0) {
      busy = true;
      let selectedPriority = Number.MIN_SAFE_INTEGER;
      let handler: Handler;
      handlers.forEach(h => {
        if (h.priority >= selectedPriority) {
          selectedPriority = h.priority;
          handler = h.handler;
        }
      });
      try {
        const result = handler!();
        if (result != null) {
          result.then(() => (busy = false), () => (busy = false));
        } else {
          busy = false;
        }
      } catch (ev) {
        busy = false;
      }
    }
  });
}
