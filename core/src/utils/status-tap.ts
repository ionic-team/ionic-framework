import { QueueApi } from '@stencil/core';

export function startStatusTap(win: Window, queue: QueueApi) {
  queue.read(async () => {
    const width = win.innerWidth;
    const height = win.innerWidth;
    const el = win.document.elementFromPoint(width / 2, height / 2);
    if (!el) {
      return;
    }
    const contentEl = el.closest('ion-content');
    if (contentEl) {
      await contentEl.componentOnReady();
      queue.write(() => {
        contentEl.scrollToTop(300);
      });
    }
  });
}
