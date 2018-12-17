import { QueueApi } from '@stencil/core';

export function startStatusTap(win: Window, queue: QueueApi) {
  win.addEventListener('statusTap', () => {
    queue.read(() => {
      const width = win.innerWidth;
      const height = win.innerHeight;
      const el = win.document.elementFromPoint(width / 2, height / 2) as (Element | null);
      if (!el) {
        return;
      }
      const contentEl = el.closest('ion-content');
      if (contentEl) {
        contentEl.componentOnReady().then(() => {
          queue.write(() => contentEl.scrollToTop(300));
        });
      }
    });
  });
}
