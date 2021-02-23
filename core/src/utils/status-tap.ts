import { readTask, writeTask } from '@stencil/core';

import { componentOnReady } from './helpers';

export const startStatusTap = () => {
  const win = window;
  win.addEventListener('statusTap', () => {
    readTask(() => {
      const width = win.innerWidth;
      const height = win.innerHeight;
      const el = document.elementFromPoint(width / 2, height / 2) as (Element | null);
      if (!el) {
        return;
      }
      const contentEl = el.closest('ion-content');
      if (contentEl) {
        new Promise(resolve => componentOnReady(contentEl, resolve)).then(() => {
          writeTask(() => contentEl.scrollToTop(300));
        });
      }
    });
  });
};
