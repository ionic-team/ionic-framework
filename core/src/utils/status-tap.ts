import { QueueController } from '../interface';

export function startStatusTap(win: Window, queue: QueueController) {
  queue.read(() => {
    const width = win.innerWidth;
    const height = win.innerWidth;
    const el = win.document.elementFromPoint(width / 2, height / 2);
    if (!el) {
      return;
    }
    const scrollEl = el.closest('ion-scroll');
    if (scrollEl) {
      scrollEl.componentOnReady().then(() => {
        queue.write(() => {
          scrollEl.scrollToTop(300);
        });
      });
    }
  });
}
