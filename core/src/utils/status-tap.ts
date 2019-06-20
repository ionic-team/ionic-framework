import { readTask, writeTask } from '@stencil/core';

export function startStatusTap(win: Window) {
  win.addEventListener('statusTap', () => {
    readTask(() => {
      const width = win.innerWidth;
      const height = win.innerHeight;
      const el = win.document.elementFromPoint(width / 2, height / 2) as (Element | null);
      if (!el) {
        return;
      }
      const contentEl = el.closest('ion-content');
      if (contentEl) {
        contentEl.componentOnReady().then(() => {
          writeTask(() => contentEl.scrollToTop(300));
        });
      }
    });
  });
}
